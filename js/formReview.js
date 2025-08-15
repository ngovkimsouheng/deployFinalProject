
// formReview.js - Complete Review System with API Integration

// Import API functions
import { getData, postData } from '../store/fetchApi.js';
import { formReviewComponent } from '../components/formComponent.js';

// Review Data Management Class
export class ReviewManager {
    constructor() {
        this.reviews = [];
        this.currentRating = 0;
        this.loadReviews();
    }

    // Load reviews from API
    async loadReviews() {
        try {
            const apiReviews = await getData('reviews'); // Adjust endpoint as needed
            this.reviews = Array.isArray(apiReviews) ? apiReviews : [];
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.reviews = window.reviewData || []; // Fallback to local storage
        }
    }
    // Add new review and save to API
    async addReview(rating, comment, placeUuid ) {
        // Get place UUID from URL or localStorage
        const urlParams = new URLSearchParams(window.location.search);

        const placeId = placeUuid || urlParams.get('placeUuid')

        const reviewData = {
            placeUuid: placeId,  // Changed from productId to placeUuid
            rating: rating,      // Keep as number
            review: comment      // Changed from comment to review
        };

        try {
            // Save to API
            const result = await postData('reviews', reviewData);
            
            // Add to local array with formatted data for display
            const review = {
                id: result.placeId || Date.now(),
                rating: rating,
                comment: comment,  // Keep as comment for display purposes
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                author: `អ្នកប្រើប្រាស់ ${Math.floor(Math.random() * 1000)}`,
                placeUuid: placeId
            };
            
            this.reviews.unshift(review);
            
            // Also save to local storage as backup
            window.reviewData = this.reviews;
            
            return review;
        } catch (error) {
            console.error('Error saving review:', error);
            throw error;
        }
    }

    // Get all reviews
    getReviews() {
        return this.reviews;
    }

    // Generate star HTML
    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fa-solid fa-star text-yellow-400"></i>';
            } else {
                stars += '<i class="fa-solid fa-star text-gray-300"></i>';
            }
        }
        return stars;
    }
}

// Setup Form Event Listeners
function setupFormEventListeners(reviewManager) {
    const stars = document.querySelectorAll('#star_list i');
    const feelingText = document.getElementById('feeling-text');
    const commentTextarea = document.getElementById('comment');
    const submitBtn = document.getElementById('submit-btn');
    const feedbackSection = document.getElementById('feedback-section');
    const thankyouSection = document.getElementById('thankyou-section');
    const backBtn = document.getElementById('back-btn');

    const feelingTexts = {
        1: 'មិនពេញចិត្ត 😞',
        2: 'ពេញចិត្តតិច 😐',
        3: 'មធ្យម 😊',
        4: 'ពេញចិត្ត 😄',
        5: 'ពេញចិត្តខ្លាំង 🤩'
    };

    // Star rating functionality
    stars.forEach((star, index) => {
        star.addEventListener('mouseover', () => {
            highlightStars(index + 1);
        });
        
        star.addEventListener('click', () => {
            reviewManager.currentRating = index + 1;
            feelingText.textContent = feelingTexts[reviewManager.currentRating];
            highlightStars(reviewManager.currentRating, true);
        });
    });

    // Reset stars on mouse leave
    document.getElementById('star_list').addEventListener('mouseleave', () => {
        if (reviewManager.currentRating > 0) {
            highlightStars(reviewManager.currentRating, true);
        } else {
            resetStars();
        }
    });

    // Submit form
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (reviewManager.currentRating === 0) {
            alert('Please select a rating!');
            return;
        }
        
        const comment = commentTextarea.value.trim();
        if (!comment) {
            alert('Please write a comment!');
            return;
        }

        // Disable submit button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            // Add review to API
            await reviewManager.addReview(reviewManager.currentRating, comment);
            
            // Show thank you section
            feedbackSection.style.display = 'none';
            thankyouSection.style.display = 'flex';
            
            // Refresh reviews display
            await displayReviews(reviewManager);
            
            // Reset form
            resetForm(reviewManager);
            
        } catch (error) {
            // Show error message
            alert('Failed to submit review. Please try again.');
            console.error('Submission error:', error);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });

    // Back button
    backBtn.addEventListener('click', () => {
        thankyouSection.style.display = 'none';
        feedbackSection.style.display = 'block';
    });

    function highlightStars(rating, permanent = false) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('text-gray-300');
                star.classList.add('text-yellow-400');
            } else {
                star.classList.remove('text-yellow-400');
                star.classList.add('text-gray-300');
            }
        });
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('text-yellow-400');
            star.classList.add('text-gray-300');
        });
    }

    function resetForm(reviewManager) {
        reviewManager.currentRating = 0;
        commentTextarea.value = '';
        feelingText.textContent = 'Select a rating';
        resetStars();
    }
}

// Display Reviews in the page
async function displayReviews(reviewManager) {
    const reviewList = document.getElementById('review-list');
    if (!reviewList) return;

    // Show loading state
    reviewList.innerHTML = `
        <div class="text-center text-gray-500 py-4">
            <i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i>
            <p>Loading reviews...</p>
        </div>
    `;

    // Reload reviews from API
    await reviewManager.loadReviews();
    const reviews = reviewManager.getReviews();
    
    if (reviews.length === 0) {
        reviewList.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <i class="fa-regular fa-comments text-4xl mb-4"></i>
                <p>No reviews yet. Be the first to share your experience!</p>
            </div>
        `;
        return;
    }

    // render reviews
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('placeUuid')
    const review = reviews.filter((re) => placeId.includes(re.placeUuid))
    console.log("review", review);

    reviewList.innerHTML = review.map(review => `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 ">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span class="text-white text-sm font-semibold">${review.author ? review.author.charAt(review.author.length - 1) : 'A'}</span>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-800 dark:text-white text-sm">${review.author || 'Anonymous'}</h4>
                        <p class="text-gray-500 dark:text-gray-400 text-xs">${review.date || new Date(review.created_at).toLocaleDateString() || 'Recently'}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-1">
                    ${reviewManager.generateStars(review.rating)}
                </div>
            </div>
            <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">${review.review}</p>
        </div>
    `).join('');

    // // Update header with review count
    // const commentsHeader = document.querySelector('#comments-section h2');
    // if (commentsHeader) {
    //     commentsHeader.textContent = `All Feedback (${reviews.length})`;
    // }
}

// Initialize Review System
export async function initializeReviewSystem() {
    const reviewManager = new ReviewManager();
    
    // Load form component
    const formContainer = document.getElementById('formReview');
    if (formContainer) {
        formContainer.innerHTML = formReviewComponent();
        setupFormEventListeners(reviewManager);
    }
    
    // Load existing reviews from API
    await displayReviews(reviewManager);
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeReviewSystem);