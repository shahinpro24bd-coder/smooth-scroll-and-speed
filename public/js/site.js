/* Signature theme behaviour: header state, mobile menu, scroll reveals and
   back-to-top. Safe to run again after js/speed.js swaps pages in place. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  function init() {
    var header = document.querySelector("[data-header]");
    var burger = document.querySelector("[data-burger]");
    var topBtn = document.querySelector("[data-top]");

    if (burger && header && !burger.__lm) {
      burger.__lm = true;
      burger.addEventListener("click", function () {
        var open = header.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    if (topBtn && !topBtn.__lm) {
      topBtn.__lm = true;
      topBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    function onScroll() {
      var y = window.scrollY || 0;
      var h = document.querySelector("[data-header]");
      var t = document.querySelector("[data-top]");
      if (h) h.classList.toggle("is-scrolled", y > 40);
      if (t) t.classList.toggle("is-visible", y > 600);
      var pb = document.querySelector(".lm-progress");
      if (pb) {
        var max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
        pb.style.setProperty("--p", Math.min(1, Math.max(0, y / max)).toFixed(4));
      }
    }
    if (!window.__lmScroll) {
      window.__lmScroll = true;
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    onScroll();

    // Scroll progress beam
    var bar = document.querySelector(".lm-progress");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "lm-progress";
      bar.setAttribute("aria-hidden", "true");
      bar.appendChild(document.createElement("span"));
      document.body.appendChild(bar);
    }

    // Pointer spotlight on glass cards
    if (!window.__lmGlow && window.matchMedia && window.matchMedia("(hover: hover)").matches) {
      window.__lmGlow = true;
      var glowSel = ".h-tile, .s-card, .a-pillar, .h-review, .p-ticket, .a-cert, .a-step, .h-why__col, .a-tcard, .h-treat__item, .c-form, .c-tip";
      document.addEventListener("pointermove", function (e) {
        var card = e.target && e.target.closest ? e.target.closest(glowSel) : null;
        if (!card) return;
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      }, { passive: true });
    }

    var items = document.querySelectorAll("[data-reveal]:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    if (window.__lmObserver) window.__lmObserver.disconnect();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    window.__lmObserver = io;
    items.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  document.addEventListener("DOMContentLoaded", init);
})();
