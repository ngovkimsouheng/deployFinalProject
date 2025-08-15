import { getData } from "../store/fetchApi.js";
import { placeDetail } from "../components/card.js";

const cardData = document.querySelector("#detailPlace-section");
const cards = await getData("places");

cards.map((card) => {
  cardData.innerHTML += placeDetail(card);
});

cards.map((card) => {
  const div = document.getElementById(`${place.name}`);
  if (div) {
    div.addEventListener(
      "click",
      () => (window.location.href = `/html/ParamDetail.html?place=${place}`)
    );
  }
});
