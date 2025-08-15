
export function formReviewComponent() {
    return `
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                មតិយោបល់   
            </h3>
            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal">
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span class="sr-only">Close modal</span>
            </button>
        </div>
        
        <div class="p-4 md:p-5 space-y-4 flex justify-center">
            <div id="feedback-section" class="bg-white dark:bg-gray-700 shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
                <div class="mb-6">
                    <h2 class="text-lg text-gray-600 dark:text-gray-300 mt-2">វាយតម្លៃបទពិសោធន៍របស់អ្នក</h2>
                    <p id="feeling-text" class="text-lg text-gray-600 dark:text-gray-400 mt-2">ជ្រើសរើសចំណាត់ថ្នាក់</p>
                </div>
                
                <!-- Stars -->
                <ul id="star_list" class="flex justify-center space-x-4 text-3xl text-gray-300 mb-6">
                    <i class="fa-solid fa-star cursor-pointer hover:text-yellow-400 transition-colors" data-value="1"></i>
                    <i class="fa-solid fa-star cursor-pointer hover:text-yellow-400 transition-colors" data-value="2"></i>
                    <i class="fa-solid fa-star cursor-pointer hover:text-yellow-400 transition-colors" data-value="3"></i>
                    <i class="fa-solid fa-star cursor-pointer hover:text-yellow-400 transition-colors" data-value="4"></i>
                    <i class="fa-solid fa-star cursor-pointer hover:text-yellow-400 transition-colors" data-value="5"></i>
                </ul>
                
                <h3 class="text-gray-700 dark:text-gray-300 text-lg mb-3">
                    ប្រាប់យើងបន្ថែមអំពីបទពិសោធន៍របស់អ្នក
                </h3>
                <textarea id="comment" rows="4" placeholder="សរសេរការវាយតម្លៃរបស់អ្នក..." class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"></textarea>
                <button id="submit-btn" type="submit" class="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-400 transition">
                    បញ្ជូន
                </button>
            </div>
            
            <!-- Thank You Section -->
            <div id="thankyou-section" class="hidden flex-col items-center text-center bg-white dark:bg-gray-700 shadow-lg rounded-2xl p-8 max-w-lg w-full ml-4">
                <button id="back-btn" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mb-4">
                    <i class="fa-solid fa-arrow-left-long mr-2"></i> Back
                </button>
                
                <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <i class="fa-solid fa-check text-3xl text-green-600"></i>
                </div>
                
                <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    អរគុណច្រើន!
                </h1>
                <h2 class="text-gray-700 dark:text-gray-300">ការវាយតម្លៃរបស់អ្នកត្រូវបានបញ្ជូនដោយជោគជ័យ</h2>
            </div>
        </div>
    `;
}

