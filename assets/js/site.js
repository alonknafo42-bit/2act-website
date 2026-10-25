// 2Act site: scroll reveals, the sticky feature phone, and the screens gallery.
// No dependencies. Content is fully visible without this file; the inline
// script in <head> adds the "js" class that opts elements into animation.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  // Nav hairline once the page has scrolled.
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Reveal on scroll. Without IntersectionObserver (or with reduced motion)
  // everything is shown at once.
  var reveals = document.querySelectorAll(".reveal");
  if (!hasIO || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { revealer.observe(el); });
  }

  // Feature story: the feature nearest the middle of the viewport becomes
  // active and the sticky phone shows its screen.
  var features = Array.prototype.slice.call(document.querySelectorAll(".feature[data-screen]"));
  var stageScreens = document.querySelectorAll(".story-stage .screen > [data-screen]");
  function activate(key) {
    features.forEach(function (f) {
      f.classList.toggle("is-active", f.getAttribute("data-screen") === key);
    });
    stageScreens.forEach(function (s) {
      s.classList.toggle("is-active", s.getAttribute("data-screen") === key);
    });
  }
  if (features.length) {
    activate(features[0].getAttribute("data-screen"));
    if (hasIO) {
      var storyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) activate(entry.target.getAttribute("data-screen"));
        });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      features.forEach(function (f) { storyObserver.observe(f); });
    }
  }

  // Screens gallery. Navigation scrolls items into view instead of doing
  // scrollLeft arithmetic, so it behaves the same in RTL and LTR.
  document.querySelectorAll("[data-gallery]").forEach(function (root) {
    var track = root.querySelector(".gallery");
    var prev = root.querySelector("[data-prev]");
    var next = root.querySelector("[data-next]");
    if (!track || !prev || !next) return;
    var items = Array.prototype.slice.call(track.children);
    var visible = new Set();

    function update() {
      var indexes = items.map(function (_, i) { return i; }).filter(function (i) { return visible.has(items[i]); });
      var first = indexes.length ? indexes[0] : 0;
      var last = indexes.length ? indexes[indexes.length - 1] : 0;
      prev.disabled = first <= 0;
      next.disabled = last >= items.length - 1;
      return { first: first, last: last };
    }

    function go(step) {
      var range = update();
      var target = step > 0 ? Math.min(range.first + 1, items.length - 1) : Math.max(range.first - 1, 0);
      items[target].scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "start"
      });
    }

    if (hasIO) {
      var galleryObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.intersectionRatio >= 0.9) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        update();
      }, { root: track, threshold: [0, 0.9, 1] });
      items.forEach(function (item) { galleryObserver.observe(item); });
    }

    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
  });

  // Footer year.
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
