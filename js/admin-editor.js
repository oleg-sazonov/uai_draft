(function () {
    "use strict";

    const AUTOSAVE_INTERVAL_MS = 10000;
    const WORDS_PER_MINUTE = 200;

    const titleEl = document.getElementById("post-title");
    const slugEl = document.getElementById("post-slug-preview");
    const statusEl = document.getElementById("post-status");
    const postCategoryEl = document.getElementById("post-category");
    const postFormEl = titleEl && titleEl.form;
    const summaryEl = document.getElementById("post-summary");
    const contentEl = document.getElementById("post-content");
    const previewEl = document.getElementById("post-content-preview");
    const toolbarEl = document.getElementById("post-editor-toolbar");
    const toggleEl = document.getElementById("post-editor-toggle");
    const statsEl = document.getElementById("post-editor-stats");
    const autosaveEl = document.getElementById("post-autosave-status");
    const partnershipEl = document.getElementById("post-partnership");

    const eventTitleEl = document.getElementById("event-title");
    const eventSlugEl = document.getElementById("event-slug-preview");
    const eventStatusEl = document.getElementById("event-status");
    const eventDescriptionEl = document.getElementById("event-description");
    const eventDescriptionPreviewEl = document.getElementById(
        "event-description-preview"
    );
    const eventToolbarEl = document.getElementById("event-editor-toolbar");
    const eventToggleEl = document.getElementById("event-editor-toggle");
    const eventStatsEl = document.getElementById("event-editor-stats");
    const eventAutosaveEl = document.getElementById("event-autosave-status");
    const eventStartDateEl = document.getElementById("event-start-date");
    const eventEndDateEl = document.getElementById("event-end-date");
    const eventLocationEl = document.getElementById("event-location");
    const eventVisibilityEl = document.getElementById("event-visibility");
    const eventRegistrationLinkEl = document.getElementById(
        "event-registration-link"
    );
    const eventFeaturedInputEl = document.getElementById(
        "event-featured-image"
    );
    const eventPreviewTitleEl = document.getElementById("event-preview-title");
    const eventPreviewMetaEl = document.getElementById("event-preview-meta");
    const eventPreviewDescEl = document.getElementById("event-preview-desc");
    const eventPreviewMediaEl = document.getElementById("event-preview-media");

    const featuredInput = document.getElementById("post-featured-image");
    const featuredPreview = document.getElementById("post-featured-preview");
    const galleryInput = document.getElementById("post-gallery-images");
    const galleryPreview = document.getElementById("post-gallery-preview");

    if (!titleEl || !contentEl) return;

    const editorState = {
        post: {
            dirty: false,
            inFlight: false,
            autosaveEl: autosaveEl,
        },
        event: {
            dirty: false,
            inFlight: false,
            autosaveEl: eventAutosaveEl,
        },
    };

    function setAutosaveStatus(editorKey, text) {
        const state = editorState[editorKey];
        if (!state || !state.autosaveEl) return;
        state.autosaveEl.textContent = text;
    }

    function slugify(value) {
        return String(value || "")
            .toLowerCase()
            .trim()
            .replace(/&/g, " and ")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    }

    function updateSlug() {
        if (!slugEl) return;
        const slug = slugify(titleEl.value) || "your-post-slug";
        slugEl.textContent = slug;
    }

    function countWords(text) {
        const matches = String(text || "")
            .trim()
            .match(/[A-Za-z0-9]+/g);
        return matches ? matches.length : 0;
    }

    function updateStats() {
        if (!statsEl) return;
        const words = countWords(contentEl.value);
        const minutes =
            words === 0 ? 0 : Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
        statsEl.textContent = words + " words" + " • " + minutes + " min read";
    }

    function updateEventSlug() {
        if (!eventSlugEl || !eventTitleEl) return;
        const slug = slugify(eventTitleEl.value) || "your-event-slug";
        eventSlugEl.textContent = slug;
    }

    function updateEventStats() {
        if (!eventStatsEl || !eventDescriptionEl) return;
        const words = countWords(eventDescriptionEl.value);
        const minutes =
            words === 0 ? 0 : Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
        eventStatsEl.textContent =
            words + " words" + " • " + minutes + " min read";
    }

    function escapeHtml(unsafe) {
        return String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderInline(text) {
        let out = escapeHtml(text);

        out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, url) {
            const safeLabel = label;
            const safeUrl = url.trim();
            if (!/^https?:\/\//i.test(safeUrl)) {
                return safeLabel;
            }
            return (
                '<a href="' +
                safeUrl +
                '" target="_blank" rel="noopener noreferrer">' +
                safeLabel +
                "</a>"
            );
        });

        out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
        return out;
    }

    function renderMarkdown(markdown) {
        const lines = String(markdown || "")
            .replace(/\r\n/g, "\n")
            .split("\n");
        const blocks = [];

        let i = 0;
        function isBlank(line) {
            return !line || /^\s*$/.test(line);
        }

        while (i < lines.length) {
            const line = lines[i];
            if (isBlank(line)) {
                i++;
                continue;
            }

            if (/^###\s+/.test(line)) {
                blocks.push(
                    "<h3>" + renderInline(line.replace(/^###\s+/, "")) + "</h3>"
                );
                i++;
                continue;
            }
            if (/^##\s+/.test(line)) {
                blocks.push(
                    "<h2>" + renderInline(line.replace(/^##\s+/, "")) + "</h2>"
                );
                i++;
                continue;
            }

            if (/^>\s?/.test(line)) {
                const quoteLines = [];
                while (i < lines.length && /^>\s?/.test(lines[i])) {
                    quoteLines.push(lines[i].replace(/^>\s?/, ""));
                    i++;
                }
                blocks.push(
                    "<blockquote><p>" +
                        renderInline(quoteLines.join("\n")) +
                        "</p></blockquote>"
                );
                continue;
            }

            if (/^[-*]\s+/.test(line)) {
                const items = [];
                while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
                    items.push(
                        "<li>" +
                            renderInline(lines[i].replace(/^[-*]\s+/, "")) +
                            "</li>"
                    );
                    i++;
                }
                blocks.push("<ul>" + items.join("") + "</ul>");
                continue;
            }

            if (/^\d+\.\s+/.test(line)) {
                const items = [];
                while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                    items.push(
                        "<li>" +
                            renderInline(lines[i].replace(/^\d+\.\s+/, "")) +
                            "</li>"
                    );
                    i++;
                }
                blocks.push("<ol>" + items.join("") + "</ol>");
                continue;
            }

            const para = [];
            while (i < lines.length && !isBlank(lines[i])) {
                para.push(lines[i]);
                i++;
            }
            blocks.push("<p>" + renderInline(para.join(" ")) + "</p>");
        }

        return blocks.join("\n");
    }

    function setMode(mode) {
        const isPreview = mode === "preview";
        if (toggleEl) {
            Array.from(toggleEl.querySelectorAll(".editor-mode-btn")).forEach(
                (btn) => {
                    const active = btn.getAttribute("data-mode") === mode;
                    btn.classList.toggle("active", active);
                    btn.setAttribute(
                        "aria-selected",
                        active ? "true" : "false"
                    );
                }
            );
        }
        if (toolbarEl) toolbarEl.hidden = isPreview;
        contentEl.hidden = isPreview;
        if (previewEl) {
            previewEl.hidden = !isPreview;
            if (isPreview) {
                previewEl.innerHTML = renderMarkdown(contentEl.value);
            }
        }
    }

    function setEventMode(mode) {
        if (!eventDescriptionEl) return;
        const isPreview = mode === "preview";
        if (eventToggleEl) {
            Array.from(
                eventToggleEl.querySelectorAll(".editor-mode-btn")
            ).forEach((btn) => {
                const active = btn.getAttribute("data-mode") === mode;
                btn.classList.toggle("active", active);
                btn.setAttribute("aria-selected", active ? "true" : "false");
            });
        }
        if (eventToolbarEl) eventToolbarEl.hidden = isPreview;
        eventDescriptionEl.hidden = isPreview;
        if (eventDescriptionPreviewEl) {
            eventDescriptionPreviewEl.hidden = !isPreview;
            if (isPreview) {
                eventDescriptionPreviewEl.innerHTML = renderMarkdown(
                    eventDescriptionEl.value
                );
            }
        }
    }

    function formatEventDate(value) {
        if (!value) return "";
        try {
            return new Date(value + "T00:00:00").toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (error) {
            return value;
        }
    }

    function updateEventPreviewCard() {
        if (eventPreviewTitleEl && eventTitleEl) {
            eventPreviewTitleEl.textContent =
                eventTitleEl.value || "Your event title will appear here";
        }

        if (eventPreviewDescEl && eventDescriptionEl) {
            const renderedDescription = renderMarkdown(
                eventDescriptionEl.value
            );
            eventPreviewDescEl.innerHTML =
                renderedDescription || "<p>Short description preview.</p>";
        }

        if (eventPreviewMetaEl) {
            const startText = formatEventDate(
                eventStartDateEl && eventStartDateEl.value
            );
            const endText = formatEventDate(
                eventEndDateEl && eventEndDateEl.value
            );
            const locationText =
                (eventLocationEl && eventLocationEl.value) || "Location";
            const dateText =
                startText && endText
                    ? startText + " → " + endText
                    : startText
                      ? startText
                      : "Start date → End date";

            eventPreviewMetaEl.textContent = dateText + " • " + locationText;
        }

        if (
            eventPreviewMediaEl &&
            eventFeaturedInputEl &&
            eventFeaturedInputEl.files &&
            eventFeaturedInputEl.files[0]
        ) {
            const file = eventFeaturedInputEl.files[0];
            const img = document.createElement("img");
            img.alt = "Event featured image preview";
            const url = URL.createObjectURL(file);
            img.src = url;
            img.onload = function () {
                URL.revokeObjectURL(url);
            };

            eventPreviewMediaEl.innerHTML = "";
            eventPreviewMediaEl.appendChild(img);
        } else if (eventPreviewMediaEl) {
            eventPreviewMediaEl.innerHTML =
                '<div class="entity-preview-media-placeholder">Featured image preview</div>';
        }
    }

    function markDirty(editorKey) {
        const state = editorState[editorKey];
        if (!state) return;
        state.dirty = true;
        setAutosaveStatus(editorKey, "Unsaved changes");
    }

    function saveDraft(editorKey) {
        const state = editorState[editorKey];
        if (!state || !state.autosaveEl) return;
        if (state.inFlight) return;
        if (!state.dirty) return;
        state.inFlight = true;
        setAutosaveStatus(editorKey, "Saving draft…");
        window.setTimeout(function () {
            state.inFlight = false;
            state.dirty = false;
            setAutosaveStatus(editorKey, "Saved");
        }, 700);
    }

    function toPartnershipArray(value) {
        if (Array.isArray(value)) {
            const firstValue = value.find(function (item) {
                return typeof item === "string" && item.trim();
            });

            return firstValue ? [firstValue.trim()] : undefined;
        }

        if (typeof value !== "string") return undefined;

        const trimmedValue = value.trim();
        return trimmedValue ? [trimmedValue] : undefined;
    }

    function syncPartnershipField(value) {
        const partnershipValues = toPartnershipArray(value);
        var selectedValue = partnershipValues ? partnershipValues[0] : "";

        if (partnershipEl) {
            var checkboxes = partnershipEl.querySelectorAll
                ? partnershipEl.querySelectorAll('input[name="partnership"]')
                : [];

            if (checkboxes.length > 0) {
                Array.from(checkboxes).forEach(function (cb) {
                    cb.checked = cb.value === selectedValue;
                });
            } else {
                partnershipEl.value = selectedValue;
            }

            partnershipEl.partnershipValue = partnershipValues;
        }

        if (postFormEl) {
            postFormEl.partnershipValue = partnershipValues;
        }
    }

    function makeDropzone(container, input, options) {
        if (!container || !input) return;

        const allowMultiple = Boolean(options && options.multiple);
        const append = Boolean(options && options.append);

        function setDragOver(on) {
            container.classList.toggle("is-dragover", on);
        }

        container.addEventListener("dragenter", function (e) {
            e.preventDefault();
            setDragOver(true);
        });
        container.addEventListener("dragover", function (e) {
            e.preventDefault();
            setDragOver(true);
        });
        container.addEventListener("dragleave", function () {
            setDragOver(false);
        });
        container.addEventListener("drop", function (e) {
            e.preventDefault();
            setDragOver(false);

            const dropped = Array.from(
                (e.dataTransfer && e.dataTransfer.files) || []
            );
            const images = dropped.filter((f) => /^image\//.test(f.type));
            if (images.length === 0) return;

            let files = images;
            if (allowMultiple && append) {
                files = Array.from(input.files || []).concat(images);
            }
            if (!allowMultiple) {
                files = [files[0]];
            }

            const dt = new DataTransfer();
            files.forEach((f) => dt.items.add(f));
            input.files = dt.files;
            input.dispatchEvent(new Event("change", { bubbles: true }));
            markDirty("post");
        });
    }

    function decorateGalleryThumbs() {
        if (!galleryPreview || !galleryInput) return;
        const thumbs = Array.from(
            galleryPreview.querySelectorAll(".file-thumb")
        );
        thumbs.forEach((thumb, idx) => {
            thumb.classList.add("is-draggable");
            thumb.draggable = true;
            thumb.dataset.index = String(idx);

            thumb.addEventListener("dragstart", function (e) {
                thumb.classList.add("is-dragging");
                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(idx));
                }
            });
            thumb.addEventListener("dragend", function () {
                thumb.classList.remove("is-dragging");
                thumbs.forEach((t) => t.classList.remove("is-drop-target"));
            });
            thumb.addEventListener("dragover", function (e) {
                if (
                    e.dataTransfer &&
                    Array.from(e.dataTransfer.files || []).length > 0
                ) {
                    return;
                }
                e.preventDefault();
                thumb.classList.add("is-drop-target");
            });
            thumb.addEventListener("dragleave", function () {
                thumb.classList.remove("is-drop-target");
            });
            thumb.addEventListener("drop", function (e) {
                if (
                    e.dataTransfer &&
                    Array.from(e.dataTransfer.files || []).length > 0
                ) {
                    return;
                }
                e.preventDefault();
                thumb.classList.remove("is-drop-target");
                const fromIndex = Number(
                    e.dataTransfer && e.dataTransfer.getData("text/plain")
                );
                const toIndex = Number(thumb.dataset.index);
                if (Number.isNaN(fromIndex) || Number.isNaN(toIndex)) return;
                if (fromIndex === toIndex) return;

                const files = Array.from(galleryInput.files || []);
                if (!files[fromIndex]) return;
                const moved = files.splice(fromIndex, 1)[0];
                files.splice(toIndex, 0, moved);

                const dt = new DataTransfer();
                files.forEach((f) => dt.items.add(f));
                galleryInput.files = dt.files;
                galleryInput.dispatchEvent(
                    new Event("change", { bubbles: true })
                );
                markDirty("post");
            });
        });
    }

    titleEl.addEventListener("input", function () {
        updateSlug();
        markDirty("post");
    });
    if (postCategoryEl) {
        postCategoryEl.addEventListener("change", function () {
            markDirty("post");
        });
    }
    if (summaryEl) {
        summaryEl.addEventListener("input", function () {
            markDirty("post");
        });
    }
    if (statusEl) {
        statusEl.addEventListener("change", function () {
            markDirty("post");
        });
    }

    contentEl.addEventListener("input", function () {
        updateStats();
        if (previewEl && !previewEl.hidden) {
            previewEl.innerHTML = renderMarkdown(contentEl.value);
        }
        markDirty("post");
    });

    if (partnershipEl) {
        partnershipEl.addEventListener("change", function (e) {
            var target = e.target;
            if (
                target &&
                target.type === "checkbox" &&
                target.name === "partnership"
            ) {
                if (target.checked) {
                    Array.from(
                        partnershipEl.querySelectorAll(
                            'input[name="partnership"]'
                        )
                    ).forEach(function (cb) {
                        if (cb !== target) cb.checked = false;
                    });
                    syncPartnershipField(target.value);
                } else {
                    syncPartnershipField("");
                }
            } else {
                syncPartnershipField(partnershipEl.value);
            }
            markDirty("post");
        });
    }

    Array.from(
        document.querySelectorAll(
            '#posts input[name="aid_type"], #posts input[name="location"], #posts input[name="video_url"], #posts select[name="visibility"]'
        )
    ).forEach((el) => {
        const eventName =
            el.type === "text" || el.type === "url" ? "input" : "change";
        el.addEventListener(eventName, function () {
            markDirty("post");
        });
        if (eventName !== "change") {
            el.addEventListener("change", function () {
                markDirty("post");
            });
        }
    });

    if (toggleEl) {
        toggleEl.addEventListener("click", function (e) {
            const btn = e.target && e.target.closest(".editor-mode-btn");
            if (!btn) return;
            const mode = btn.getAttribute("data-mode") || "edit";
            setMode(mode);
        });
    }

    if (eventTitleEl) {
        eventTitleEl.addEventListener("input", function () {
            updateEventSlug();
            updateEventPreviewCard();
            markDirty("event");
        });
    }

    if (eventStatusEl) {
        eventStatusEl.addEventListener("change", function () {
            markDirty("event");
        });
    }

    if (eventDescriptionEl) {
        eventDescriptionEl.addEventListener("input", function () {
            updateEventStats();
            if (
                eventDescriptionPreviewEl &&
                !eventDescriptionPreviewEl.hidden
            ) {
                eventDescriptionPreviewEl.innerHTML = renderMarkdown(
                    eventDescriptionEl.value
                );
            }
            updateEventPreviewCard();
            markDirty("event");
        });
    }

    [eventStartDateEl, eventEndDateEl, eventLocationEl].forEach(function (el) {
        if (!el) return;
        el.addEventListener("input", function () {
            updateEventPreviewCard();
            markDirty("event");
        });
        el.addEventListener("change", function () {
            updateEventPreviewCard();
            markDirty("event");
        });
    });

    [eventVisibilityEl, eventRegistrationLinkEl].forEach(function (el) {
        if (!el) return;
        const eventName = el.tagName === "INPUT" ? "input" : "change";
        el.addEventListener(eventName, function () {
            markDirty("event");
        });
        if (eventName !== "change") {
            el.addEventListener("change", function () {
                markDirty("event");
            });
        }
    });

    if (eventFeaturedInputEl) {
        eventFeaturedInputEl.addEventListener("change", function () {
            window.setTimeout(updateEventPreviewCard, 0);
            markDirty("event");
        });
    }

    if (eventToggleEl) {
        eventToggleEl.addEventListener("click", function (e) {
            const btn = e.target && e.target.closest(".editor-mode-btn");
            if (!btn) return;
            const mode = btn.getAttribute("data-mode") || "edit";
            setEventMode(mode);
        });
    }

    makeDropzone(featuredPreview, featuredInput, {
        multiple: false,
        append: false,
    });
    makeDropzone(galleryPreview, galleryInput, {
        multiple: true,
        append: true,
    });
    if (featuredInput) {
        featuredInput.addEventListener("change", function () {
            markDirty("post");
        });
    }
    if (galleryInput) {
        galleryInput.addEventListener("change", function () {
            decorateGalleryThumbs();
            markDirty("post");
        });
    }

    const saveDraftBtn = document.querySelector(
        '#posts .publish-actions .btn-secondary[type="button"]'
    );
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener("click", function () {
            markDirty("post");
            saveDraft("post");
        });
    }

    const saveEventDraftBtn = document.querySelector(
        '#events .publish-actions .btn-secondary[type="button"]'
    );
    if (saveEventDraftBtn) {
        saveEventDraftBtn.addEventListener("click", function () {
            markDirty("event");
            saveDraft("event");
        });
    }

    window.setInterval(function () {
        saveDraft("post");
        saveDraft("event");
    }, AUTOSAVE_INTERVAL_MS);

    if (postFormEl) {
        postFormEl.getPartnershipValue = function () {
            return toPartnershipArray(
                partnershipEl && partnershipEl.partnershipValue
            );
        };

        postFormEl.setPartnershipValue = function (value) {
            syncPartnershipField(value);
        };
    }

    updateSlug();
    updateStats();
    setMode("edit");
    setAutosaveStatus("post", "Saved");
    (function initPartnership() {
        if (!partnershipEl) return;
        var checked = partnershipEl.querySelector(
            'input[name="partnership"]:checked'
        );
        syncPartnershipField(checked ? checked.value : "");
    })();
    decorateGalleryThumbs();
    updateEventSlug();
    updateEventStats();
    setEventMode("edit");
    setAutosaveStatus("event", "Saved");
    updateEventPreviewCard();
})();
