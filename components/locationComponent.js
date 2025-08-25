export const locationDetailsComponent = (card) => {
  return `

        <section class="flex flex-col gap-4  ">
            <div >
                <h2 class="text-3xl text-primary dark:text-dark-secondary font-bold leading-relaxed md:mt-8 max-md:mt-5">${card.name}</h2>
                <p class="text-xl dark:text-white leading-relaxed md:py-8 max-md:py-5">${card.description}</p>
            </div>
            <div>
                <iframe  class="w-full lg:h-[55vh] md:h-[50vh]  max-md:h-[45vh]  rounded-lg  justify-end shadow  border-gray-700 border-1"
                src="https://www.google.com/maps?q=${card.latitude},${card.longitude}&hl=en&z=14&output=embed">
                </iframe>
            </div>
        </section>
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
