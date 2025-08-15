export const locationDetailsComponent = (card) => {
  return `

        <div class="  md:mt-7 ">
            <h2 class="text-3xl text-primary font-bold leading-relaxed">${card.name}</h2>
            <p class="text-xl leading-relaxed">${card.description}</p>
        </div>
        <div class="justify-end md:mt-7">
            <iframe  class="w-full  h-[480px]  rounded-lg  justify-end shadow  border-gray-700 border-1" 
            src="https://www.google.com/maps?q=${card.latitude},${card.longitude}&hl=en&z=14&output=embed">
            </iframe>
        </div>
    `;
};

// export const locationDetailsComponent = (card) => {
//   return `
//     <div class="items-start">
//         <p class="text-xl leading-relaxed">${card.description}</p>
//     </div>
//     <div class="justify-end mt-7">
//         <iframe 
//             class="w-[675px] h-[480px] rounded-lg justify-end shadow border-gray-700 border-1" 
//             src="https://www.google.com/maps?q=${card.lat},${card.lng}&hl=en&z=14&output=embed">
//         </iframe>
//     </div>
//   `;
// };
