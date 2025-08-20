document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
);
// Whenever the user explicitly chooses light mode
localStorage.theme = "light";
// Whenever the user explicitly chooses dark mode
localStorage.theme = "dark";
// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem("theme");

function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.theme = isDark ? "dark" : "light";
}

// custom button
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");

  themeToggle.addEventListener("click", () => {
    // Toggle opacity classes for a smooth fade effect
    sunIcon.classList.toggle("opacity-0");
    moonIcon.classList.toggle("opacity-0");
  });
});
