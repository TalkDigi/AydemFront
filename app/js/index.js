const counter = document.querySelector(".counter");
const increment = counter.querySelector(".increment");
const decrement = counter.querySelector(".decrement");
const input = counter.querySelector("input");

const heroSlide = new Splide(".hero", {
  perPage: 1,
  // autoWidth: true,
  arrows: false,
  cover: true,
  height: "500px",
  rewindSpeed: 900,
}).mount();
heroSlide.on("move", function (newIndex, oldIndex, destIndex) {
  heroSlide.Components.Elements.slides[oldIndex].classList.remove("show");
  heroSlide.Components.Elements.slides[newIndex].classList.add("show");
});

const indexSlide = (id, options, mount) => {
  const splide = new Splide("#" + id, {
    pagination: false,
    lazyLoad: "nearby",
    arrows: false,
    perMove: 1,
    ...options,
  }).mount(mount);
  document.getElementById(id + "Prev").addEventListener("click", () => {
    splide.go("-1");
  });
  document.getElementById(id + "Next").addEventListener("click", () => {
    splide.go("+1");
  });
};

increment.addEventListener("click", () => input.stepUp());
decrement.addEventListener("click", () => input.stepDown());
window.addEventListener("load", function () {
  indexSlide("videoGallery", {
    perPage: 3,
    autoWidth: false,
    gap: "15px",
    breakpoints: {
      992: {
        autoWidth: true,
        perPage: 1,
      },
      1200: {
        perPage: 2,
      },
    },
  });
  indexSlide("campaing", {
    type: "loop",
    autoWidth: true,
  });
  indexSlide("products", {
    type: "loop",
    autoWidth: true,
    gap: "15px",
  });
  indexSlide("projects", {
    type: "loop",
    rewind: true,
    perPage: 1,
    speed: 700,
  });
  indexSlide("newsGallery", {
    type: "loop",
    perPage: 4,
    autoWidth: false,
    gap: "15px",
    speed: 700,
    breakpoints: {
      992: {
        autoWidth: true,
        perPage: 1,
      },
      1200: {
        perPage: 2,
      },
    },
  });
  lightGallery(document.getElementById("aniimated-thumbnials"), {
    thumbnail: true,
    loadYoutubeThumbnail: true,
    youtubeThumbSize: "default",
    loadVimeoThumbnail: true,
  });
  // new Choices("#mapCity", {});
  // new Choices("#mapTown", {});
});
