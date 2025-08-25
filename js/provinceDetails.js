'use strict';

const pageTitle = document.getElementById('pageTitle');
const province_detail_places = document.querySelector('#renderDetailPlace');
const base_url = 'https://tos-der.sokpheng.com/api/v1/places';

// 1. Get category name from URL
const urlParams = new URLSearchParams(window.location.search);
const categoryName = urlParams.get('category');

// 2. Set page title
pageTitle.textContent = categoryName ? `` : 'គ្មានប្រភេទត្រូវបានជ្រើសរើស';

async function fetchAllDetails() {
  try {
    const res = await fetch(base_url);
    const data = await res.json();

    console.log('API Data:', data);
    console.log('Category from URL:', categoryName);

    const catRes = data.map((item) => item.category.name);
    console.log(catRes);

    // Display filtered results
    province_detail_places.innerHTML = data
      .filter((place) => categoryName.includes(place.category.name))
      .map((place) => {
        // get data with siem reap category
        if (place.category.name === 'Siem Reap') {
          return ` <a 
 id="${place.name}"
 href="./ParamDetail.html?placeUuid=${place.uuid}"
  class="block bg-white dark:bg-accent/50 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
>
  <div class="relative h-64 w-full">
    <img
      src="${place.imageUrls[2]}"
      alt="ខេត្ត សៀមរាប"
      class="absolute inset-0 w-full h-full object-cover"
    />
  </div>
  <div class="p-4">
    <div class="flex justify-between items-center">
      <h3 class="text-primary dark:text-dark-secondary text-[22px] font-primary font-semibold">
        ${place.name}
      </h3>
      <i class="fa-regular fa-heart text-xl text-gray-900 dark:text-white"></i>
    </div>
    <p class="text-gray-600 dark:text-white text-[17px] line-clamp-2 mt-2">
      ${place.description}
    </p>
  </div>
</a>`;
        } else if (place.category.name === 'Phnom Penh') {
          return ` <a 
 id="${place.name}"
 href="./ParamDetail.html?placeUuid=${place.uuid}"
  class="block bg-white dark:bg-accent/50 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
>
  <div class="relative h-64 w-full">
    <img
      src="${place.imageUrls[2]}"
      alt="ខេត្ត សៀមរាប"
      class="absolute inset-0 w-full h-full object-cover"
    />
  </div>
  <div class="p-4">
    <div class="flex justify-between items-center">
      <h3 class="text-primary dark:text-dark-secondary text-[22px] font-primary font-semibold">
        ${place.name}
      </h3>
      <i class="fa-regular fa-heart text-xl text-gray-900 dark:text-white"></i>
    </div>
    <p class="text-gray-600 dark:text-white text-[17px] line-clamp-2 mt-2">
      ${place.description}
    </p>
  </div>
</a>`;
        } else if (place.category.name === 'Kep') {
          return ` <a 
 id="${place.name}"
 href="./ParamDetail.html?placeUuid=${place.uuid}"
  class="block bg-white dark:bg-accent/50 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
>
  <div class="relative h-64 w-full">
    <img
      src="${place.imageUrls[2]}"
      alt="ខេត្ត សៀមរាប"
      class="absolute inset-0 w-full h-full object-cover"
    />
  </div>
  <div class="p-4">
    <div class="flex justify-between items-center">
      <h3 class="text-primary dark:text-dark-secondary text-[22px] font-primary font-semibold">
        ${place.name}
      </h3>
      <i class="fa-regular fa-heart text-xl text-gray-900 dark:text-white"></i>
    </div>
    <p class="text-gray-600 dark:text-white text-[17px] line-clamp-2 mt-2">
      ${place.description}
    </p>
  </div>
</a>`;
        } else if (place.category.name === 'Kom pot') {
          return ` <a 
 id="${place.name}"
 href="./ParamDetail.html?placeUuid=${place.uuid}"
  class="block bg-white dark:bg-accent/50 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
>
  <div class="relative h-64 w-full">
    <img
      src="${place.imageUrls[2]}"
      alt="ខេត្ត សៀមរាប"
      class="absolute inset-0 w-full h-full object-cover"
    />
  </div>
  <div class="p-4">
    <div class="flex justify-between items-center">
      <h3 class="text-primary dark:text-dark-secondary text-[22px] font-primary font-semibold">
        ${place.name}
      </h3>
      <i class="fa-regular fa-heart text-xl text-gray-900 dark:text-white"></i>
    </div>
    <p class="text-gray-600 dark:text-white text-[17px] line-clamp-2 mt-2">
      ${place.description}
    </p>
  </div>
</a>`;
        }
      })
      .join('');
  } catch (error) {
    console.error('Error fetching details:', error);
  }
}

fetchAllDetails();
