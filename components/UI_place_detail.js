export const placeDetailUI = (place) => {
  return `  
    <div
        class="grid lg:container  gap-4 lg:mx-auto 
 grid-cols-[1fr_1fr_1fr] max-sm:grid-cols-2
 grid-rows-[48%_48%] max-lg:h-[70vh] max-sm:h-[60vh] md:h-[75vh] h-auto lg:h-[85vh] "
      >
        <!-- Item 1 -->
        <div
         
          class="relative overflow-hidden rounded-[10px] shadow-lg group sm:col-span-2  "
          data-aos="fade-up"
        >
          <img
            src=${place.imageUrls[0]}
            alt="Place Images"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent">
            <h3 class="text-xl font-semibold"></h3>
          </div>
        </div>

        <!-- Item 2 -->
        <div
         
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
        </div>

        <!-- Item 3 -->
        <div
        
          class="relative overflow-hidden rounded-[10px] shadow-lg group "
          data-aos="fade-up"
        >
          <img
            src=${place.imageUrls[3]}
            alt="Place Images"
            class="h-full col-start-1 col-end-2 w-full  object-cover transition-transform duration-500  group-hover:scale-110"
          />
          <div class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent">
            <h3 class="text-xl font-semibold"></h3>
          </div>
        </div>

        <!-- Item 4 -->
        <div
        
          class="relative overflow-hidden rounded-[10px] shadow-lg group sm:col-span-2 "
          data-aos="fade-up"
        >
          <img
            src=${place.imageUrls[4]}
            alt="Place Images"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute bottom-0 p-2 text-white text-shadow-lg text-shadow-accent">
            <h3 class="text-xl font-semibold"></h3>
          </div>
        </div>
      </div>



`;
};
