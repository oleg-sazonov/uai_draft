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
})();
