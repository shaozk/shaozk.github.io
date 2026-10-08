(function () {
  var lightbox = document.getElementById("photo-lightbox");
  if (!lightbox) return;

  var imgEl = lightbox.querySelector(".photo-lightbox__img");
  var captionEl = lightbox.querySelector(".photo-lightbox__caption");
  var closeBtn = lightbox.querySelector(".photo-lightbox__close");
  var lastFocus = null;

  function open(href, caption) {
    imgEl.src = href;
    imgEl.alt = caption || "";
    captionEl.textContent = caption || "";
    lightbox.hidden = false;
    document.body.classList.add("photo-lightbox-open");
    lastFocus = document.activeElement;
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    imgEl.src = "";
    captionEl.textContent = "";
    document.body.classList.remove("photo-lightbox-open");
    if (lastFocus) lastFocus.focus();
  }

  var items = document.querySelectorAll(".photo-item");
  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener("click", function (event) {
      event.preventDefault();
      open(this.getAttribute("href"), this.getAttribute("data-caption"));
    });
  }

  closeBtn.addEventListener("click", close);

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) close();
  });
})();
