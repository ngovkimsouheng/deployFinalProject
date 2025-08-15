export const placeDetailUI = (place) => {
  return `  
    <div
        class="grid container gap-4 mx-auto 
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr] 
              lg:grid-rows-[48%_48%] h-auto lg:h-[90vh]"
      >
        <!-- Item 1 -->
        <a
          href="#"
          class="relative overflow-hidden rounded-[10px] shadow-lg group 
                sm:col-span-2 lg:col-start-1 lg:col-end-3"
          data-aos="fade-up"
        >
          <img
            src=${place.imageUrls[0]}
            alt="Angkor Wat"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent">
            <h3 class="text-xl font-semibold"></h3>
          </div>
        </a>

        <!-- Item 2 -->
        <a
          href="#"
          class="relative overflow-hidden rounded-[10px] shadow-lg group"
          data-aos="fade-up"
        >
          <img
            src=${place.imageUrls[2]}
            alt="Koh Rong"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent">
            <h3 class="text-xl font-semibold"></h3>
          </div>
        </a>

        <!-- Item 3 -->
        <a
          href="#"
          class="relative overflow-hidden rounded-[10px] shadow-lg group"
          data-aos="fade-up"
        >
          <img
            src=${place.imageUrls[3]}
            alt="Angkor Wat"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent">
            <h3 class="text-xl font-semibold"></h3>
          </div>
        </a>

        <!-- Item 4 -->
        <a
          href="#"
          class="relative overflow-hidden rounded-[10px] shadow-lg group 
                sm:col-span-2 lg:col-span-2"
          data-aos="fade-up"
        >
          <img
            src=${place.imageUrls[4]}
            alt="Angkor Wat"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent">
            <h3 class="text-xl font-semibold"></h3>
          </div>
        </a>
      </div>



`;
};
