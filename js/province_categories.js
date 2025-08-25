'use strict';

const provinces = document.getElementById('province_categories');
const base_url = 'https://tos-der.sokpheng.com/api/v1/categories';

const targetCategoryNames = ['Siem reap', 'Phnom Penh', 'Kom pot', 'Kep'];

// section2
async function fetchProvinceCategories() {
  try {
    const res = await fetch(base_url);
    const data = await res.json();

    console.log(data);

    if (!Array.isArray(data)) {
      console.error('Unexpected data format:', data);
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
          <h3 class="text-3xl text-shadow-xl text-shadow-accent sm:p-3 max-sm:p-1 font-bold max-sm:text-xl">សៀមរាប</h3>
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
          <h3 class="text-3xl text-shadow-xl text-shadow-accent sm:p-3 max-sm:p-1 font-bold  max-sm:text-xl">ភ្នំពេញ</h3>
        </div>
      </a>

      <a
        data-aos="fade-right"
         
        href="../html/provinceDetails.html?category=${filteredCategories[2].name}"
        class="relative overflow-hidden rounded-[10px] shadow-lg group"
      >
        <img
          src="https://hanoivoyage.com/uploads//Blogs/Cambodia/Visit-Cambodia/thumnail/kampot-thumbnail-01.jpg"
          class="h-full w-full object-cover group-hover:scale-110 duration-500 transition-transform"
        />
        <div class="absolute bottom-0 p-2 text-white">
          <h3 class="text-3xl text-shadow-xl text-shadow-accent sm:p-3 max-sm:p-1 font-bold max-sm:text-xl">កំពត</h3>
        </div>
      </a>

      <a
       data-aos="fade-left"
          
        href="../html/provinceDetails.html?category=${filteredCategories[3].name}"
        class="relative overflow-hidden rounded-[10px] shadow-lg group"
      >
        <img
          src="https://cdn.i-scmp.com/sites/default/files/styles/1020x680/public/images/methode/2018/05/28/8b4bd47c-5fd9-11e8-a4de-9f5e0e4dd719_1280x720_174720.JPG?itok=YEctsX3I"
          class="h-full w-full object-cover group-hover:scale-110 duration-500 transition-transform"
        />
        <div class="absolute bottom-0 p-2 text-white">
          <h3 class="text-3xl text-shadow-xl text-shadow-accent sm:p-3 max-sm:p-1 font-bold max-sm:text-xl">កែប</h3>
        </div>
      </a>
    `;
  } catch (e) {
    console.log(e);
  }
}

fetchProvinceCategories();

// section4
const base_url1 = 'https://tos-der.sokpheng.com/api/v1/places';
const PlaceSuggestions = document.getElementById('place_Suggestion');
const targetPlaceInProvinceName = [
  'ប្រាសាទអង្គរវត្ត',
  'ឆ្នេរកែប',
  'ដូងទេរ',
  'ប្រាសាទភ្នំបាណន់',
];

async function PlaceSuggestionsList() {
  try {
    const res = await fetch(base_url1);
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error('Unexpected data format:', data);
      return;
    }

    // Filter
    const filteredPlaces = data.filter((place) =>
      targetPlaceInProvinceName.some(
        (name) => name.toLowerCase() === place.name.toLowerCase()
      )
    );

    console.log('Filtered places:', filteredPlaces);

    PlaceSuggestions.innerHTML = filteredPlaces
      .map(
        (place) => `
        <div data-aos="fade-right" data-aos-delay="200" class="bg-white dark:bg-accent/50 rounded-xl shadow-lg overflow-hidden">
          <a href="../html/ParamDetail.html?placeUuid=${place.uuid}" >
          <div class="bg-teal-900 dark:bg-dark-primary px-6 py-3  flex justify-between items-center">
            <h3 class="text-white text-[24px] font-bold">${place.name}</h3>
            <span
              class=" text-white text-sm px-3 py-1 rounded-[10px]"
              ></span
            >
          </div>
          <div  class="p-4 text-accent dark:text-white text-[18px]">
            <p class="line-clamp-3">${place.description}...</p>
            <ul class="list-disc pt-6 pl-6 space-y-1">
              <li>${place.openHours}</li>
              <li>${place.entryFee}</li>
      
            </ul>
            <a class="text-teal-700 dark:text-dark-secondary float-end pb-6 " href="../html/ParamDetail.html?uuid=${place.uuid}">ព័ត៌មានបន្ថែម</li>
          </div>
          </a>
      </div>
      `
      )
      .join('');
  } catch (e) {
    console.error(e);
  }
}

PlaceSuggestionsList();
