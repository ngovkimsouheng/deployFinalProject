(() => {
  try {
    const ls = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (ls === "dark" || (!ls && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch {}
})();
const btn = document.getElementById("toggleTheme");
const html = document.documentElement;

btn.addEventListener("click", () => {
  const isDark = html.classList.toggle("dark");
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch {}
});
