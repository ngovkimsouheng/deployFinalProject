"use strict";
const base_url = "https://tos-der.sokpheng.com/api/v1/places";
const popularPlacesCategories = document.querySelector("#categories");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");
const seeMoreBtn = document.querySelector("#seeMoreBtn");

let allPlaces = [];
let currentPlaces = []; // 🔥 track filtered or all places
let displayedCount = 0; // how many cards are currently shown
const initialCount = 8;   // show 2 rows (4 cards per row for lg) on first render
const loadMoreCount = 100;  // how many more cards load per click

// ================== Fetch Data ==================
async function fetchCategories() {
  try {
    const res = await fetch(base_url);
    const data = await res.json();
    allPlaces = data;
    currentPlaces = allPlaces; // default = all data

    renderPlaces(currentPlaces, true); // true = initial render
    populateCategories(allPlaces);

    if (categorySelect.value) {
      filterPlaces();
    }
  } catch (error) {
    console.log("Fetch error:", error);
  }
}

// ================== Populate Category Dropdown ==================
function populateCategories(places) {
  const uniqueCategories = [...new Set(places.map((p) => p.category.name))];
  const existingValues = new Set(
    Array.from(categorySelect.options).map((opt) => opt.value)
  );

  uniqueCategories.forEach((cat) => {
    if (!existingValues.has(cat)) {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    }
  });
}

// ================== Render Places ==================
function renderPlaces(places, isInitial = false) {
  if (places.length === 0) {
    popularPlacesCategories.innerHTML = `
      <div class="flex flex-col items-center justify-center">
        <img src="../img/cannotfind.gif" alt="place not found" class="w-48 h-48 object-contain">
        <p class="text-center text-gray-600 mt-2">រកមិនឃើញទេ</p>
      </div>
    `;
    seeMoreBtn.classList.add("hidden");
    return;
  }

  // Reset if initial render
  if (isInitial) {
    displayedCount = 0;
    popularPlacesCategories.innerHTML = "";
  }

  // how many to load
  const countToLoad = isInitial ? initialCount : loadMoreCount;

  const cardsToShow = places.slice(displayedCount, displayedCount + countToLoad);

  popularPlacesCategories.innerHTML += cardsToShow
    .map(
      (data) => `
        <a href="./ParamDetail.html?placeUuid=${data.uuid}" 
           class="block bg-white dark:bg-accent/50 rounded-lg shadow overflow-hidden hover:shadow-secondary/30 hover:shadow-[1px_2px_20px] transition-all duration-300 ease-in-out transform hover:-translate-y-1">
          <div class="relative h-64 w-full">
            <img src="${data.imageUrls[1]}" 
                 alt="${data.name}" 
                 class="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div class="p-4 ">
            <div class="flex justify-between items-center">
              <h3 class="text-primary dark:text-dark-secondary text-[22px] font-primary font-semibold">${data.name}</h3>
            </div>
            <p class="text-gray-600 dark:text-white text-[17px] line-clamp-2 mt-2">${data.description}</p>
          </div>
        </a>
      `
    )
    .join("");

  displayedCount += cardsToShow.length;

  // Show or hide See More button
  if (displayedCount >= places.length) {
    seeMoreBtn.classList.add("hidden");
  } else {
    seeMoreBtn.classList.remove("hidden");
  }
}

// ================== Filter ==================
function filterPlaces() {
  const keyword = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;
  const matchField = searchInput.dataset.matchField || "name,description";
  const searchExact = searchInput.dataset.exact === "true";
  const fieldsToCheck = matchField.split(",").map((f) => f.trim());

  const filtered = allPlaces.filter((place) => {
    const matchesSearch = fieldsToCheck.some((field) => {
      const fieldValue = field.includes(".")
        ? field.split(".").reduce((obj, key) => obj?.[key], place)
        : place[field];
      if (!fieldValue) return false;
      return searchExact
        ? fieldValue.toLowerCase() === keyword
        : fieldValue.toLowerCase().includes(keyword);
    });

    const matchesCategory = selectedCategory
      ? place.category.name === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  currentPlaces = filtered; // 🔥 save filtered list
  renderPlaces(currentPlaces, true); // reset render
}

// ================== Event Listeners ==================
searchInput.addEventListener("input", filterPlaces);
categorySelect.addEventListener("change", filterPlaces);
seeMoreBtn.addEventListener("click", () => renderPlaces(currentPlaces));

// ================== Init ==================
fetchCategories();
