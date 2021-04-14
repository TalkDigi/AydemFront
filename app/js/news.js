const eventslide = new Splide("#event-slide", {
  loop:true,
  perPage: 1,
  arrows: false,
}).mount();

const indexSlide = (id, options) => {
  const splide = new Splide("#" + id, options).mount();
  document.getElementById(id + "Prev").addEventListener("click", () => {
    splide.go("-1");
  });
  document.getElementById(id + "Next").addEventListener("click", () => {
    splide.go("+1");
  });
};

window.addEventListener("load", function () {
  indexSlide("newsGallery", {
    type: "loop",
    perPage: 4,
    autoWidth: false,
    gap: "15px",
    arrows: false,
    breakpoints: {
      992: {
        perPage: 1,
        autoWidth: true,
      },
      1200: {
        perPage: 2,
      },
    },
  });
});
