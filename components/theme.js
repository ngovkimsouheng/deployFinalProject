"use strict";

const btn = document.getElementById("toggleTheme");
const html = document.documentElement;

// default state (check if dark mode is active from localStorage or OS)
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  html.classList.add("dark");
  btn.innerHTML = `<img src="/image/dark_mode_24dp_1F1F1F_FILL1_wght400_GRAD0_opsz24.png" alt="Dark mode" class="w-6 h-6" />`;
} else {
  html.classList.remove("dark");
  btn.innerHTML = `<img src="/image/sunny_24dp_1F1F1F_FILL1_wght400_GRAD0_opsz24.png" alt="Light mode" class="w-6 h-6" />`;
}

// toggle button
btn.addEventListener("click", () => {
  html.classList.toggle("dark");

  if (html.classList.contains("dark")) {
    btn.innerHTML = `<img src="/image/dark_mode_24dp_1F1F1F_FILL1_wght400_GRAD0_opsz24.png" alt="Dark mode" class="w-6 h-6" />`;
    localStorage.theme = "dark";
  } else {
    btn.innerHTML = `<img src="/image/sunny_24dp_1F1F1F_FILL1_wght400_GRAD0_opsz24.png" alt="Light mode" class="w-6 h-6" />`;
    localStorage.theme = "light";
  }
});
