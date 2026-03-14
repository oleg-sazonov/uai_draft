(function () {
    "use strict";

    function clearNode(node) {
        while (node.firstChild) node.removeChild(node.firstChild);
    }

    function createThumb(file) {
        const thumb = document.createElement("div");
        thumb.className = "file-thumb";

        const img = document.createElement("img");
        img.alt = file.name;

        const url = URL.createObjectURL(file);
        img.src = url;
        img.onload = function () {
            URL.revokeObjectURL(url);
        };

        const caption = document.createElement("div");
        caption.className = "file-thumb-caption";
        caption.textContent = file.name;

        thumb.appendChild(img);
        thumb.appendChild(caption);
        return thumb;
    }

    function setupFilePreview(options) {
        const input = document.getElementById(options.inputId);
        const target = document.getElementById(options.previewId);
        if (!input || !target) return;

        input.addEventListener("change", function () {
            clearNode(target);
            const files = Array.from(input.files || []);
            if (files.length === 0) {
                return;
            }

            if (options.multiple) {
                files.forEach((file) => target.appendChild(createThumb(file)));
            } else {
                target.appendChild(createThumb(files[0]));
            }
        });
    }

    setupFilePreview({
        inputId: "post-featured-image",
        previewId: "post-featured-preview",
        multiple: false,
    });
    setupFilePreview({
        inputId: "post-gallery-images",
        previewId: "post-gallery-preview",
        multiple: true,
    });
    setupFilePreview({
        inputId: "event-featured-image",
        previewId: "event-featured-preview",
        multiple: false,
    });

    // Simple event preview binding (visual-only)
    const eventTitle = document.getElementById("event-title");
    const eventStart = document.getElementById("event-start-date");
    const eventEnd = document.getElementById("event-end-date");
    const eventLocation = document.getElementById("event-location");
    const eventDesc = document.getElementById("event-description");
    const eventImgInput = document.getElementById("event-featured-image");

    const previewTitle = document.getElementById("event-preview-title");
    const previewMeta = document.getElementById("event-preview-meta");
    const previewDesc = document.getElementById("event-preview-desc");
    const previewMedia = document.getElementById("event-preview-media");

    function formatDate(value) {
        if (!value) return "";
        try {
            return new Date(value + "T00:00:00").toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (e) {
            return value;
        }
    }

    function updateEventPreview() {
        if (previewTitle && eventTitle) {
            previewTitle.textContent =
                eventTitle.value || "Your event title will appear here";
        }

        if (previewDesc && eventDesc) {
            previewDesc.textContent =
                eventDesc.value || "Short description preview.";
        }

        const startText = formatDate(eventStart && eventStart.value);
        const endText = formatDate(eventEnd && eventEnd.value);
        const locationText =
            (eventLocation && eventLocation.value) || "Location";

        const dateText =
            startText && endText
                ? startText + " → " + endText
                : startText
                  ? startText
                  : "Start date → End date";

        if (previewMeta) {
            previewMeta.textContent = dateText + " • " + locationText;
        }

        if (
            previewMedia &&
            eventImgInput &&
            eventImgInput.files &&
            eventImgInput.files[0]
        ) {
            const file = eventImgInput.files[0];
            const img = document.createElement("img");
            img.alt = "Event featured image preview";
            const url = URL.createObjectURL(file);
            img.src = url;
            img.onload = function () {
                URL.revokeObjectURL(url);
            };

            clearNode(previewMedia);
            previewMedia.appendChild(img);
        }
    }

    [eventTitle, eventStart, eventEnd, eventLocation, eventDesc].forEach(
        (el) => {
            if (!el) return;
            el.addEventListener("input", updateEventPreview);
            el.addEventListener("change", updateEventPreview);
        }
    );
    if (eventImgInput)
        eventImgInput.addEventListener("change", updateEventPreview);
    updateEventPreview();
})();
