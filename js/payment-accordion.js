// Payment Methods Accordion functionality
document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".payment-method-item");

    items.forEach((item) => {
        const header = item.querySelector(".payment-method-header");
        const content = item.querySelector(".payment-method-content");

        if (!header || !content) return;
        if (header.hasAttribute("data-accordion-initialized")) return;
        header.setAttribute("data-accordion-initialized", "true");

        header.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Close others
            items.forEach((other) => {
                if (other !== item && other.classList.contains("active")) {
                    const otherContent = other.querySelector(
                        ".payment-method-content"
                    );
                    other.classList.remove("active");
                    otherContent.style.maxHeight = "0";
                }
            });

            if (isActive) {
                // Close current
                content.style.maxHeight = content.scrollHeight + "px";
                requestAnimationFrame(() => {
                    item.classList.remove("active");
                    content.style.maxHeight = "0";
                });
            } else {
                // Open current
                item.classList.add("active");
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Recalculate heights on resize for open items
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            items.forEach((item) => {
                if (item.classList.contains("active")) {
                    const content = item.querySelector(
                        ".payment-method-content"
                    );
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }, 200);
    });
});

// // Payment Methods Accordion functionality (same pattern as accordion.js)
// document.addEventListener("DOMContentLoaded", function () {
//     const paymentItems = document.querySelectorAll(".payment-method-item");

//     paymentItems.forEach(function (item, index) {
//         const header = item.querySelector(".payment-method-header");

//         if (header && !header.hasAttribute("data-accordion-initialized")) {
//             header.setAttribute("data-accordion-initialized", "true");

//             // First item open by default
//             if (index === 0) {
//                 item.classList.add("active");
//             }

//             header.addEventListener("click", function () {
//                 item.classList.toggle("active");
//             });
//         }
//     });
// });
