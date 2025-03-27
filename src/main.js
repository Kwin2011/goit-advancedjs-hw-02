
import { createTimer } from './js/1-timer';
import { handleForm } from './js/2-snackbar.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log(window.location.pathname)
  if (window.location.pathname.includes("1-timer.html")) {
    createTimer();
  } else if (window.location.pathname.includes("2-snackbar.html")) {
    handleForm();
  }

  const links = document.querySelectorAll("nav a");
  const contentSection = document.getElementById("dynamic-content");

  links.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const url = link.getAttribute("href");

      try {
        const response = await fetch(url);
        const html = await response.text();
        contentSection.innerHTML = html;

        if (url.includes("1-timer.html")) {
          createTimer();
        } else if (url.includes("2-snackbar.html")) {
          handleForm();
        }
      } catch (error) {
        console.error("Error loading content:", error);
        contentSection.innerHTML = "<p>Failed to load content.</p>";
      }
    });
  });
});
