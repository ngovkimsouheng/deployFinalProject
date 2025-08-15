export const provinceCategoriesComponent = (provinces) => {
  return `
      <div
          class="grid grid-cols-[33%_33%_33%] grid-rows-[45%_45%] md:gap-4 md:mx-4 max-md:gap-1"
        >
          <a
            href="#"
            class="relative overflow-hidden rounded-[10px] shadow-lg group col-start-1 col-end-3"
            data-aos="fade-up"
          >
            <img
              src="https://wallpapercat.com/w/full/e/3/3/1531314-2600x1733-desktop-hd-angkor-siem-reap-wallpaper-photo.jpg"
              alt="Angkor Wat"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent"
            >
              <h3 class="text-xl font-semibold">${provinces.name}</h3>
            </div>
          </a>
          <a
            href="#"
            class="relative overflow-hidden rounded-[10px] shadow-lg group col-start-3 col-end-4 row-start-1 row-end-3"
            data-aos="fade-up"
          >
            <img
              src="https://wallpapercat.com/w/full/e/3/3/1531314-2600x1733-desktop-hd-angkor-siem-reap-wallpaper-photo.jpg"
              alt="Koh rong"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent"
            >
              <h3 class="text-xl font-semibold">${provinces.name}</h3>
            </div>
          </a>
          <a
            href="#"
            class="relative overflow-hidden rounded-[10px] shadow-lg group"
            data-aos="fade-up"
          >
            <img
              src="https://wallpapercat.com/w/full/e/3/3/1531314-2600x1733-desktop-hd-angkor-siem-reap-wallpaper-photo.jpg"
              alt="Angkor Wat"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent"
            >
              <h3 class="text-xl font-semibold">${provinces.name}</h3>
            </div>
          </a>
          <a
            href="#"
            class="relative overflow-hidden rounded-[10px] shadow-lg group"
            data-aos="fade-up"
          >
            <img
              src="https://wallpapercat.com/w/full/e/3/3/1531314-2600x1733-desktop-hd-angkor-siem-reap-wallpaper-photo.jpg"
              alt="Angkor Wat"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent"
            >
              <h3 class="text-xl font-semibold">${provinces.name}</h3>
            </div>
          </a>
        </div>
  `;
};
