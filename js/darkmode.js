let darkBackground = document.querySelector("body");
let darkModeBtn = document.getElementById("darkModeBtn");
let btnIcon = document.getElementById("btnIcon");
let codeButton = document.getElementsByClassName("btn-dark");

darkModeBtn.addEventListener("click", function () {
//   darkBackground.classList.toggle("darkbackground");
  btnIcon.classList.toggle("fa-sun");
  btnIcon.classList.toggle("fa-moon");
  for (var i = 0, len = codeButton.length; len > i; i++) {
    codeButton[i].classList.toggle("btn-light");
    codeButton[i].classList.toggle("btn-dark");
  }
});
