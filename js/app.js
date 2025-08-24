// const base_url = "https://tos-der.sokpheng.com/api/v1/categories";
// const provinceContainer = document.getElementById("province_categories");
// const provinceButtons = document.getElementById("province_buttons");
// let allPlaces = [];

// // 1. Fetch data
// async function fetchPlaces() {
//   try {
//     const res = await fetch(base_url);
//     const data = await res.json();
//     allPlaces = data; // store all data
//     createProvinceButtons();
//   } catch (err) {
//     console.error("Error fetching data:", err);
//   }
// }


// function createProvinceButtons() {
//   const uniqueProvinces = [
//     ...new Set(allPlaces.map((item) => item.category.name)),
//   ];

//   uniqueProvinces.forEach((province) => {
//     const btn = document.createElement("button");
//     btn.textContent = province;
//     btn.className =
//       "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition";
//     btn.addEventListener("click", () => filterByProvince(province));
//     provinceButtons.appendChild(btn);
//   });

//   if (uniqueProvinces.length > 0) {
//     filterByProvince(uniqueProvinces[0]);
//   }
// }


// function filterByProvince(provinceName) {
//   const filtered = allPlaces.filter(
//     (item) => item.category.name.toLowerCase() === provinceName.toLowerCase()
//   );
//   renderPlaces(filtered);
// }

// function renderPlaces(places) {
//   provinceContainer.innerHTML = "";

//   places.forEach((place, index) => {
//     const card = document.createElement("a");
//     card.href = `ParamDetail.html?id=${place.id}`;
//     card.className = `relative overflow-hidden rounded-[10px] shadow-lg group ${
//       index === 0
//         ? "col-start-1 col-end-3"
//         : index === 1
//         ? "col-start-3 col-end-4 row-start-1 row-end-3"
//         : ""
//     }`;
//     card.setAttribute("data-aos", "fade-up");

//     card.innerHTML = `
//       <img
//         src="${place.imageUrls[0]}"
//         alt="${place.name}"
//         class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
//       />
//       <div class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent">
//         <h3 class="text-xl font-semibold">${place.name}</h3>
//       </div>
//     `;

//     provinceContainer.appendChild(card);
//   });
// }

// // Run fetch
// fetchPlaces();
