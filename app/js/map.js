let thisLocation = null;
let mims = {};
const cityObj = {};
var myMap;
const earthRadius = 6371;
const mapLink = (element) => {
  return thisLocation
    ? String.raw`rtext=${thisLocation.latitude},${thisLocation.longitude}~${element.latitude},${element.longitude}&rtt=mt`
    : String.raw`whatshere[point]=${element.longitude},${element.latitude}&whatshere`;
};
const mimsHtml = (element) => {
  return String.raw`
<div class="mims-grid-item">
  <h3>${element.name.replace("MİM", "")}<small>${
    element.name.includes("MİM") && "Müşteri İlişkileri Merkezi"
  }</small></h3>
  <hr>
  <address>${element.address}</address>
  <p>Hafta içi : <span>08.00 - 18.00</span></p>
  <div class="d-flex mt-auto">
  <a href="tel:${element.phoneNumber}"><i class="icon-phone"></i>${
    element.phoneNumber
  }</a>
  <a target="_blank" href="https://yandex.com/maps/?${mapLink(
    element
  )}[zoom]=17"><i class="icon-location"></i>Yol Tarifi Alın</a>
  </div>
</div>
`;
};
const indexHtml = (element, i) => {
  return String.raw`
<div class="accord-item">
<button class="accord-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${
    element.code
  }" aria-expanded="true" aria-controls="collapse${element.code}">
  ${element.name.replace("MİM", "")}<small>${
    element.name.includes("MİM") && "Müşteri İlişkileri Merkezi"
  }</small>
</button>
<div id="collapse${element.code}" class="accord-collapse collapse ${
    i == 0 && "show"
  }" aria-labelledby="headingOne" data-bs-parent="#mapAccordion">
  <div class="accord-body">
      <div class="d-flex">
          <a href="tel:${element.phoneNumber}"><i class="icon-phone"></i>${
    element.phoneNumber
  }</a>
  <a target="_blank" href="https://yandex.com/maps/?${mapLink(
    element
  )}[zoom]=17">
  <i class="icon-location"></i>Yol Tarifi Alın</a>
      </div>
      <address>${element.address}</address>
      <p>Hafta içi : <span>08.00 - 18.00</span></p>
  </div>
</div>
</div>
`;
};
const mapData = async () => {
  const response = await fetch(
    window.location.protocol + "//" + window.location.host + "/js/mims.json"
  );
  const responseJson = await response.json();
  return responseJson;
};
const townData = async () => {
  const response = await fetch(
    window.location.protocol + "//" + window.location.host + "/js/ililce.json"
  );
  const responseJson = await response.json();
  return responseJson;
};
const addTown = (e) => {
  e.target.value == 0 && addAllMims();
  document.getElementById("mapTown").innerHTML =
    "<option selected>İlçe Seçiniz</option>";
  for (const key in cityObj) {
    if (key == e.target.value) {
      for (const townCode in cityObj[key]) {
        document.getElementById("mapTown").insertAdjacentHTML(
          "beforeend",
          `
            <option value="${townCode}">${cityObj[key][townCode].name}</option>
          `
        );
      }
    }
  }
};
const addAddress = (e) => {
  document.getElementById("mapAccordion").innerHTML = "";
  const selectMims = mims.filter((obj) => obj.townCode == e.target.value);
  myMap.setCenter([selectMims[0].latitude, selectMims[0].longitude]);
  selectMims.forEach((element, i) => {
    myMap.geoObjects.add(
      new ymaps.Placemark(
        [element.latitude, element.longitude],
        {
          balloonContent: `<strong>${element.name}</strong>`,
        },
        {
          preset: "islands#icon",
          iconColor: "#923c8c",
        }
      )
    );
    document.querySelector(".mims")
      ? document
          .getElementById("mapAccordion")
          .insertAdjacentHTML("beforeend", mimsHtml(element))
      : document
          .getElementById("mapAccordion")
          .insertAdjacentHTML("beforeend", indexHtml(element, i));
  });
};
const addAllMims = () => {
  document.getElementById("mapAccordion").innerHTML = "";
  mims.forEach((e) => {
    document.getElementById("mapAccordion").insertAdjacentHTML(
      "beforeend",
      `
        <div class="mims-grid-item">
          <h3>
            ${e.name.replace("MİM", "")}
            <small>
              ${e.name.includes("MİM") && "Müşteri İlişkileri Merkezi"}
            </small>
          </h3>
          <hr>
          <address>${e.address}</address>
          <p>Hafta içi : <span>08.00 - 18.00</span></p>
          <div class="d-flex mt-auto">
          <a href="tel:${e.phoneNumber}"><i class="icon-phone"></i>${
        e.phoneNumber
      }</a>
      <a target="_blank" href="https://yandex.com/maps/?${mapLink(e)}[zoom]=17">
        <i class="icon-location"></i>Yol Tarifi Alın
      </a>
          </div>
        </div>
      `
    );
  });
};
const locationError = (error) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Tarayıcınızın konum bilgilerinize erişimine izin vermelisiniz.";
      break;
    case error.POSITION_UNAVAILABLE:
      return "Konum bilgisi şu anda mevcut değil.";
      break;
    case error.TIMEOUT:
      return "Kullanıcı konumu isteği zaman aşımına uğradı.";
      break;
    case error.UNKNOWN_ERROR:
      return "Bilinmeyen bir hata oluştu.";
      break;
  }
};
const calculateDistance = (posA, posB) => {
  const lat = posB.latitude - posA.latitude; // Enlem farkı
  const lon = posB.longitude - posA.longitude; // Boylam farkı
  const disLat = (lat * Math.PI * earthRadius) / 180; // Dikey Uzaklık
  const disLon = (lon * Math.PI * earthRadius) / 180; // Yatay Uzaklık
  let ret = Math.pow(disLat, 2) + Math.pow(disLon, 2);
  ret = Math.sqrt(ret); // Toplam mesafe (Pisagor tarafından hesaplanır: a ^ 2 + b ^ 2 = c ^ 2)
  // Toplam Mesafe
  return ret;
};
const getLocation = () => {
  document.getElementById("mapAccordion").innerHTML = "";
  if (!navigator.geolocation) {
    alert("Tarayıcınızda Geolocation desteği bulunmuyor");
    document.querySelector(".mims") && addAllMims();
  } else {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        thisLocation = position.coords;
        for (var index = 0; index < 1381; index++) {
          const mimsLength = document.querySelector(".mims")
            ? mims.length
            : mims.length;
          for (let i = 0; i < mimsLength; i++) {
            const e = mims[i];
            const dist = calculateDistance(position.coords, {
              latitude: e.latitude,
              longitude: e.longitude,
            });
            if (index - 1 <= dist && dist <= index) {
              if (document.querySelector(".mims")) {
                document
                  .getElementById("mapAccordion")
                  .insertAdjacentHTML("beforeend", mimsHtml(e));
              } else {
                document
                  .getElementById("mapAccordion")
                  .insertAdjacentHTML("beforeend", indexHtml(e, i));
              }
            }
          }
        }
      },
      (error) => {
        alert(locationError(error), "Hata", "error");
      }
    );
  }
};
const mapInit = () => {
  myMap = new ymaps.Map("map", {
    center: [41.015137, 28.97953],
    zoom: 13,
    controls: [],
  });
  myMap.behaviors.disable("scrollZoom");
};
(async () => {
  const allAddress = await townData().then((e) => {
    return e;
  });
  mims = await mapData().then((e) => {
    return e;
  });
  await mims.forEach((e) => {
    const result = allAddress.find((obj) => obj.townCode == e.townCode);
    if (cityObj.hasOwnProperty(result.cityName)) {
      cityObj[result.cityName][e.townCode] = { name: result.townName };
    } else {
      (cityObj[result.cityName] = { [result.townCode]: result.townName }),
        { id: result };
      cityObj[result.cityName][e.townCode] = { name: result.townName };
    }
  });
  getLocation();
  for (const key in cityObj) {
    document.getElementById("mapCity").insertAdjacentHTML(
      "beforeend",
      `
        <option value="${key}">${key}</option>
      `
    );
  }
})();

ymaps.ready(mapInit);
document.getElementById("mapCity").addEventListener("change", addTown);
document.getElementById("mapTown").addEventListener("change", addAddress);
