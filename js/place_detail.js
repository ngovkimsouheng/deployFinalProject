import { getData } from "../store/fetchApi.js";
import { placeDetailUI } from "../components/UI_place_detail.js";
import { notfoundComponent } from "../components/notFound.js";

// const placeData = document.querySelector("#detailPlace-section");
const places = await getData("places");
console.log("data", places);

// get place by name
const params = new URLSearchParams(window.location.search);
const uuid = params.get("placeUuid");

// find place
const placeDetails = document.getElementById("detailPlaces");
const place = places.find((p) => String(p.uuid) === String(uuid));
if (place) {
  placeDetails.innerHTML = placeDetailUI(place);
} else {
  placeDetails.innerHTML = notfoundComponent();
}

