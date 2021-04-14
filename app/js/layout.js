const toggleCollapse = new bootstrap.Collapse(
  document.getElementById("menuToggle"),
  {
    toggle: false,
  }
);
const quickCollapse = new bootstrap.Collapse(
  document.getElementById("menuQuick"),
  {
    toggle: false,
  }
);
const searchCollapse = new bootstrap.Collapse(
  document.getElementById("menuSearch"),
  {
    toggle: false,
  }
);
const windowLoad = () => {
  const preloader = document.querySelector(".preloader");
  document.querySelector("body").classList.add("loaded");
  setTimeout(() => {
    preloader.parentNode.removeChild(preloader);
  }, 1250);
};
const scrollUp = () => {
  if (window.scrollY > 100) {
    document.getElementById("up").classList.add("show");
  } else {
    document.getElementById("up").classList.remove("show");
  }
};
const speech = {
  recognition: null,
  message: null,
  micOn: null,
  micOff: null,
  init: function (selectedHeader) {
    if (selectedHeader) {
      speech.input = document.querySelector(".menu-search #search-input");
      speech.message = document.querySelector(".menu-search .error");
      speech.micOn = document.querySelector(".menu-search #speech-on");
      speech.micOff = document.querySelector(".menu-search #speech-off");
    } else {
      speech.input = document.querySelector(".search #search-input");
      speech.message = document.querySelector(".search .error");
      speech.micOn = document.querySelector(".search #speech-on");
      speech.micOff = document.querySelector(".search #speech-off");
    }
    if (
      window.hasOwnProperty("SpeechRecognition") ||
      window.hasOwnProperty("webkitSpeechRecognition")
    ) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          speech.micOn.onclick = speech.start;
          speech.micOff.onclick = speech.stop;
          speech.micOff.disabled = true;
        })
        .catch(function (err) {
          speech.message.innerHTML = "Lütfen mikrofon erisimine izin verin";
        });
    } else {
      speech.message.innerHTML = "Konuşma desteklenmiyor.";
    }
  },
  start: function () {
    speech.micOn.style.display = "none";
    speech.micOff.style.display = "flex";
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    speech.recognition = new SpeechRecognition();
    speech.recognition.continuous = true;
    speech.recognition.interimResults = false;
    speech.recognition.lang = "tr-TR";
    speech.recognition.onerror = function (evt) {
      console.log(evt);
    };
    speech.recognition.onresult = function (evt) {
      speech.input.value = evt.results[0][0].transcript;
      speech.stop();
    };
    speech.micOn.disabled = true;
    speech.micOff.disabled = false;
    speech.recognition.start();
  },

  stop: function () {
    if (speech.recognition != null) {
      speech.recognition.stop();
      speech.recognition = null;
      speech.micOn.disabled = false;
      speech.micOff.disabled = true;
    }
    speech.micOff.style.display = "none";
    speech.micOn.style.display = "flex";
  },
};
const stickyHeader = () => {
  if (window.scrollY > 80 && window.innerWidth >= 992) {
    toggleCollapse.show();
    document.querySelector(".header").classList.add("sticky");
  } else {
    document.querySelector(".header").classList.remove("sticky");
    toggleCollapse.hide();
  }
};
const allCollapseToggle = () => {
  document
    .querySelectorAll(
      '.header [data-bs-toggle="collapse"]:not([data-bs-target="#headerCollapse"])'
    )
    .forEach((element) => {
      document
        .querySelector(element.getAttribute("href"))
        .addEventListener("show.bs.collapse", function () {
          toggleCollapse.hide();
          quickCollapse.hide();
          searchCollapse.hide();
        });
    });
};
const hideCollapse = (e) => {
  if (e.target.closest(".collapse") == null) {
    // toggleCollapse.hide();
    quickCollapse.hide();
    searchCollapse.hide();
  }
};

// Event Listener
document.addEventListener("scroll", () => {
  scrollUp();
  stickyHeader();
});
window.addEventListener("load", () => {
  windowLoad();
  allCollapseToggle();
});
var menuSearch = document.getElementById('menuSearch')
menuSearch.addEventListener('shown.bs.collapse', function () {
  speech.init(true)
})
menuSearch.addEventListener('hidden.bs.collapse', function () {
  speech.init(false)
})
