"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const menuIcon = document.getElementById("menu-icon");
  menuToggle.addEventListener("click", () => {
    // Toggle the 'hidden' class to show/hide the menu
    navLinks.classList.toggle("hidden");

    // Change the icon based on the menu state
    if (navLinks.classList.contains("hidden")) {
      menuIcon.name = "menu"; // Menu is closed
    } else {
      menuIcon.name = "close"; // Menu is open
    }
  });

  // Hide the menu
  const links = navLinks.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (!navLinks.classList.contains("hidden")) {
        navLinks.classList.add("hidden");
        menuIcon.name = "menu";
      }
    });
  });
});

// Auto-slide script
let currentIndex = 0;
function slideImages() {
  const slider = document.getElementById("slider");
  const slides = slider.children.length;
  currentIndex = (currentIndex + 1) % slides;
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}
setInterval(slideImages, 3000); // Slide every 3 seconds

// text typing animation
const texts = [
  "១. មូលហេតុ",
  "២. ទស្សនវិស័យ",
  "៣. គោលបំណង",
]; //["OUR REASON", "OUR VISION", "OUR PURPOSE"];
const typingElement = document.getElementById("typing-text");
const cursor = document.querySelector(".blinking-cursor");
let textIndex = 0;
let charIndex = 0;
let typing = true;

function typeEffect() {
  const currentText = texts[textIndex];

  if (typing) {
    typingElement.textContent = currentText.slice(0, charIndex++);
    if (charIndex > currentText.length) {
      typing = false;
      setTimeout(typeEffect, 1500);
      return;
    }
  } else {
    typingElement.textContent = currentText.slice(0, --charIndex);
    if (charIndex === 0) {
      typing = true;
      textIndex = (textIndex + 1) % texts.length;
    }
  }
  setTimeout(typeEffect, typing ? 100 : 50); // typing speed
}

typeEffect();
//
function filterByProvince(province) {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    if (province === "all" || card.dataset.province === province) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

