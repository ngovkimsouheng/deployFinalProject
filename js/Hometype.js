"use strict";

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
