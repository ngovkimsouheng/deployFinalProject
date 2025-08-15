export const placeDetail = (place) => {
  return `  
         <a 
 id="${place.name}"
 href="./ParamDetail.html?id=${place.id}"
  class="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
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
      <h3 class="text-primary text-[22px] font-primary font-semibold">
        ${place.name}
      </h3>
      <i class="fa-regular fa-heart text-xl text-gray-900"></i>
    </div>
    <p class="text-gray-600 text-[17px] line-clamp-2 mt-2">
      ${place.description}
    </p>
  </div>
</a>

  `;
};
