/**
 * Admin Tab Navigation
 * Handles switching between admin sections
 */

(function () {
    "use strict";

    // Get all tab buttons and content sections
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    // Add click event to each tab button
    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const targetTab = this.getAttribute("data-tab");

            // Remove active class from all buttons
            tabButtons.forEach((btn) => btn.classList.remove("active"));

            // Hide all tab contents
            tabContents.forEach((content) =>
                content.classList.remove("active")
            );

            // Add active class to clicked button
            this.classList.add("active");

            // Show the target tab content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });

    // Ensure first tab is active on load
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons[0].classList.add("active");
        tabContents[0].classList.add("active");
    }
})();
