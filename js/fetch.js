"use strict";
const places = document.querySelector("#Place");

async function fetchAllcategories() {
  try {
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();
    places.innerHTML = data.products
      .map(
        (product) => `    <div
            class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <div class="relative h-72 w-full">
              <img
                src=${place.images[1]}
                alt="ខេត្ត សៀមរាប"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <div class="flex justify-between items-center">
                <h3 class="text-primary font-primary font-bold">
                  ${place.title}
                </h3>
                <i class="fa-regular fa-heart text-xl text-gray-900"></i>
              </div>
              <p class="text-gray-600 mt-2">
             $place.description}
              </p>
            </div>
          </div>`
      )
      .join("");
  } catch (error) {
    console.log(error);
  }
}
fetchAllcategories();
