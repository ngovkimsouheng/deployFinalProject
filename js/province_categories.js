"use strict";

const provinces = document.getElementById("province_categories");
const base_url = "https://tos-der.sokpheng.com/api/v1/categories";

const targetCategoryNames = ["Siem reap", "Phnom Penh", "Kom pot", "Kep"];

async function fetchProvinceCategories() {
  try {
    const res = await fetch(base_url);
    const data = await res.json();

    console.log(data);

    if (!Array.isArray(data)) {
      console.error("Unexpected data format:", data);
      return;
    }

    let filteredCategories = [];

    for (let i = 0; i < targetCategoryNames.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (
          data[j].name.toLowerCase() === targetCategoryNames[i].toLowerCase()
        ) {
          filteredCategories.push(data[j]);
          break;
        }
      }
    }

    provinces.innerHTML = `
      <a
       data-aos="fade-up"
         
        href="../html/provinceDetails.html?category=${filteredCategories[0].name}"
        class="relative overflow-hidden rounded-[10px] shadow-lg group col-start-1 col-end-3"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/d4/20171126_Angkor_Wat_4712_DxO.jpg"
          class="h-full w-full object-cover group-hover:scale-110 duration-500 transition-transform"
        />
        <div class="absolute bottom-0 p-2 text-white">
          <h3 class="text-3xl text-shadow-xl text-shadow-accent sm:p-3 max-sm:p-1 font-bold max-sm:text-xl max-sm:text-xl">សៀមរាប</h3>
        </div>
      </a>

      <a
        data-aos="fade-left"
         
        href="../html/provinceDetails.html?category=${filteredCategories[1].name}"
        class="relative overflow-hidden rounded-[10px] shadow-lg group col-start-3 col-end-4 row-start-1 row-end-3"
      >
        <img
          src="https://turuhi.com/storage/story/9-Independence-Monument-Cambodia.jpg"
          class="h-full w-full object-cover group-hover:scale-110 duration-500 transition-transform"
        />
        <div class="absolute bottom-0 p-2 text-white">
          <h3 class="text-3xl text-shadow-xl text-shadow-accent sm:p-3 max-sm:p-1 font-bold max-sm:text-xl max-sm:text-xl">ភ្នំពេញ</h3>
        </div>
      </a>

      <a
        data-aos="fade-up"
         
        href="../html/provinceDetails.html?category=${filteredCategories[2].name}"
        class="relative overflow-hidden rounded-[10px] shadow-lg group"
      >
        <img
          src="https://hanoivoyage.com/uploads//Blogs/Cambodia/Visit-Cambodia/thumnail/kampot-thumbnail-01.jpg"
          class="h-full w-full object-cover group-hover:scale-110 duration-500 transition-transform"
        />
        <div class="absolute bottom-0 p-2 text-white">
          <h3 class="text-3xl text-shadow-xl text-shadow-accent sm:p-3 max-sm:p-1 font-bold max-sm:text-xl max-sm:text-xl">កំពត</h3>
        </div>
      </a>

      <a
       data-aos="fade-up"
          
        href="../html/provinceDetails.html?category=${filteredCategories[3].name}"
        class="relative overflow-hidden rounded-[10px] shadow-lg group"
      >
        <img
          src="https://cdn.i-scmp.com/sites/default/files/styles/1020x680/public/images/methode/2018/05/28/8b4bd47c-5fd9-11e8-a4de-9f5e0e4dd719_1280x720_174720.JPG?itok=YEctsX3I"
          class="h-full w-full object-cover group-hover:scale-110 duration-500 transition-transform"
        />
        <div class="absolute bottom-0 p-2 text-white">
          <h3 class="text-3xl text-shadow-xl text-shadow-accent sm:p-3 max-sm:p-1 font-bold max-sm:text-xl max-sm:text-xl">កែប</h3>
        </div>
      </a>
    `;
  } catch (e) {
    console.log(e);
  }
}

fetchProvinceCategories();
