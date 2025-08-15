"use strict";

const texts2 = ["ភាពរីករាយនៃការធ្វើដំណើរទៅកាន់កម្ពុជា"];

const typingElement2 = document.getElementById("travel-typing");
const cursor2 = document.querySelector(".blinking-cursor");

let textIndex2 = 0;
let charIndex2 = 0;
let typing2 = true;

function typeEffect2() {
  const currentText = texts2[textIndex2];

  if (typing2) {
    typingElement2.textContent = currentText.slice(0, charIndex2++);
    if (charIndex2 > currentText.length) {
      typing2 = false;
      setTimeout(typeEffect2, 1500); // pause after finishing
      return;
    }
  } else {
    typingElement2.textContent = currentText.slice(0, --charIndex2);
    if (charIndex2 === 0) {
      typing2 = true;
      textIndex2 = (textIndex2 + 1) % texts2.length;
    }
  }

  setTimeout(typeEffect2, typing2 ? 100 : 50); // typing speed
}

document.addEventListener("DOMContentLoaded", typeEffect2);
// // Get elements
// const toggleDark = document.getElementById("toggleDark");
// const html = document.documentElement; // or document.body

// // Load saved theme from localStorage
// if (localStorage.theme === "dark") {
//   html.classList.add("dark");
// } else if (localStorage.theme === "light") {
//   html.classList.remove("dark");
// }

// // Toggle on click
// toggleDark.addEventListener("click", () => {
//   html.classList.toggle("dark");

//   // Save to localStorage
//   if (html.classList.contains("dark")) {
//     localStorage.theme = "dark";
//   } else {
//     localStorage.theme = "light";
//   }
// });

const toggleDark = document.getElementById("toggleDark");
const html = document.documentElement;

toggleDark.addEventListener("click", () => {
  html.classList.toggle("dark");

  if (html.classList.contains("dark")) {
    toggleDark.classList.replace("fa-sun", "fa-moon");
  } else {
    toggleDark.classList.replace("fa-moon", "fa-sun");
  }
});
