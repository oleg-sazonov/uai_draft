// Desktop & Mobile dropdown functionality
document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");
        const menu = dropdown.querySelector(".dropdown-menu");

        menu.style.display = "none";

        if (!toggle || !menu) return;

        // Desktop hover (only works above 950px)
        if (window.innerWidth > 950) {
            dropdown.addEventListener("mouseenter", () => {
                menu.style.display = "block";
            });
            dropdown.addEventListener("mouseleave", () => {
                menu.style.display = "none";
            });
        }

        // Mobile click toggle
        toggle.addEventListener("click", function (e) {
            if (window.innerWidth <= 950) {
                e.preventDefault();
                e.stopPropagation();

                // Toggle current dropdown
                const isActive = dropdown.classList.contains("mobile-active");

                menu.style.display = "block";

                // Close all other dropdowns
                document.querySelectorAll(".dropdown").forEach((d) => {
                    d.classList.remove("mobile-active");
                });

                // Toggle current
                if (!isActive) {
                    dropdown.classList.add("mobile-active");
                }
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
        if (window.innerWidth <= 950) {
            const navbar = document.querySelector(".navbar");
            const hamburger = document.querySelector(".hamburger");
            const menuToggle = document.querySelector(".menu-toggle");

            // Don't close if clicking on hamburger or menu toggle
            if (
                e.target === hamburger ||
                hamburger.contains(e.target) ||
                e.target === menuToggle
            ) {
                return;
            }

            // Close dropdowns if clicking outside navbar
            if (!navbar.contains(e.target)) {
                menuToggle.checked = false;
                document.querySelectorAll(".dropdown").forEach((d) => {
                    d.classList.remove("mobile-active");
                });
            }
        }
    });

    // Handle window resize
    window.addEventListener("resize", function () {
        if (window.innerWidth > 950) {
            document.querySelectorAll(".dropdown").forEach((d) => {
                d.classList.remove("mobile-active");
            });
            // Reset mobile menu
            const menuToggle = document.querySelector(".menu-toggle");
            if (menuToggle) {
                menuToggle.checked = false;
            }
        }
    });
});
