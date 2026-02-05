// Mobile accordion functionality for state map sections
document.addEventListener("DOMContentLoaded", function () {
    // Only activate on mobile/tablet (below 950px)
    function initMobileAccordion() {
        if (window.innerWidth <= 950) {
            const stateSections =
                document.querySelectorAll(".state-map-section");

            stateSections.forEach(function (section, index) {
                const header = section.querySelector(".state-header-mobile");

                if (
                    header &&
                    !header.hasAttribute("data-accordion-initialized")
                ) {
                    // Mark as initialized to prevent duplicate listeners
                    header.setAttribute("data-accordion-initialized", "true");

                    // First section open by default on mobile
                    if (index === 0) {
                        section.classList.add("mobile-active");
                    }

                    // Add click handler
                    header.addEventListener("click", function () {
                        section.classList.toggle("mobile-active");
                    });
                }
            });
        } else {
            // On desktop, ensure all sections are visible
            const stateSections =
                document.querySelectorAll(".state-map-section");
            stateSections.forEach(function (section) {
                section.classList.remove("mobile-active");
                const header = section.querySelector(".state-header-mobile");
                if (header) {
                    header.removeAttribute("data-accordion-initialized");
                }
            });
        }
    }

    // Initialize on load
    initMobileAccordion();

    // Reinitialize on window resize
    let resizeTimer;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            initMobileAccordion();
        }, 250);
    });
});
