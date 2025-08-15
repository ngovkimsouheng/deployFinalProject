"usse strict";
document.addEventListener("DOMContentLoaded", function () {
  const scrollers = document.querySelectorAll(".animate-scroll-left");

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
  }

  function addAnimation() {
    scrollers.forEach((scroller) => {
      // Add 'data-animated' attribute to the element
      scroller.setAttribute("data-animated", true);

      // Clone the contents of the scroller
      const scrollerInner = scroller.querySelector("template");
      const scrollerContent = scrollerInner.content;

      // Duplicate the content to create a seamless loop
      for (let i = 0; i < 2; i++) {
        scroller.appendChild(scrollerContent.cloneNode(true));
      }
    });
  }
});
