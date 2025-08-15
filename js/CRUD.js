"usse strict";

// API Configuration
const API_BASE_URL = "https://tos-der.sokpheng.com/api/v1";
const PLACES_ENDPOINT = `${API_BASE_URL}/places`;

// Global state
let places = [];
let currentPage = 1;
const placesPerPage = 6;

// DOM Elements
const placesList = document.getElementById("placesList");
const placeForm = document.getElementById("placeForm");
const resetBtn = document.getElementById("resetBtn");
const refreshBtn = document.getElementById("refreshBtn");
const searchInput = document.getElementById("searchInput");
const loadingIndicator = document.getElementById("loadingIndicator");
const placesContainer = document.getElementById("placesContainer");
const noResultsMessage = document.getElementById("noResultsMessage");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");

// Initialize the app
function initApp() {
  fetchPlaces();
  setupEventListeners();
}

// Fetch places from API
async function fetchPlaces() {
  try {
    showLoading();
    const response = await fetch(PLACES_ENDPOINT);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    places = await response.json();

    // Filter out disabled places
    places = places.filter((place) => !place.disabled);

    renderPlaces();
    renderPagination();
  } catch (error) {
    console.error("Error fetching places:", error);
    showError("Failed to load places. Please try again later.");
  } finally {
    hideLoading();
  }
}

async function createPlace(placeData) {
  try {
    const response = await fetch(PLACES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(placeData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create place: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating place:", error);
    throw error;
  }
}


async function updatePlace(id, placeData) {
  try {
    const response = await fetch(`${PLACES_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(placeData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update place: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating place:", error);
    throw error;
  }
}

// Soft delete place (set disabled: true)
async function deletePlace(id) {
  try {
    const response = await fetch(`${PLACES_ENDPOINT}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ disabled: true }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete place: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting place:", error);
    throw error;
  }
}

// Render places to the UI
function renderPlaces() {
  // Apply search filter
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPlaces = places;

  if (searchTerm) {
    filteredPlaces = places.filter(
      (place) =>
        place.name.toLowerCase().includes(searchTerm) ||
        place.description.toLowerCase().includes(searchTerm) ||
        place.category.name.toLowerCase().includes(searchTerm)
    );
  }

  // Check if we have places to show
  if (filteredPlaces.length === 0) {
    placesContainer.classList.add("hidden");
    noResultsMessage.classList.remove("hidden");
    return;
  }

  noResultsMessage.classList.add("hidden");
  placesContainer.classList.remove("hidden");

  // Calculate pagination
  const startIndex = (currentPage - 1) * placesPerPage;
  const paginatedPlaces = filteredPlaces.slice(
    startIndex,
    startIndex + placesPerPage
  );

  placesList.innerHTML = "";

  paginatedPlaces.forEach((place) => {
    const card = document.createElement("div");
    card.className =
      "place-card fade-in bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-primary";
    card.innerHTML = `
                    <div class="relative">
                        <div class="h-48 overflow-hidden">
                            <img src="${place.imageUrls[0]}" alt="${
      place.name
    }" class="w-full h-full object-cover">
                        </div>
                        <span class="absolute top-3 right-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                            ${place.category.name}
                        </span>
                        <span class="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            ID: ${place.id}
                        </span>
                    </div>
                    <div class="p-4">
                        <h3 class="font-bold text-lg text-gray-800 mb-2">${
                          place.name
                        }</h3>
                        <p class="text-gray-600 text-sm mb-4 line-clamp-2">${
                          place.description
                        }</p>
                        <div class="flex justify-between items-center">
                            <div class="text-xs text-gray-500">
                                <i class="far fa-clock mr-1"></i> ${
                                  place.openHours
                                }
                            </div>
                            <div class="text-sm font-semibold text-primary">
                                $${place.entryFee.toFixed(2)}
                            </div>
                        </div>
                    </div>
                    <div class="px-4 py-3 bg-gray-50 flex justify-end space-x-2">
                        <button onclick="editPlace(${
                          place.id
                        })" class="text-sm bg-secondary hover:bg-secondary-dark text-white px-3 py-1 rounded-lg transition duration-300">
                            <i class="fas fa-edit mr-1"></i> Edit
                        </button>
                        <button onclick="softDeletePlace(${
                          place.id
                        })" class="text-sm bg-danger hover:bg-danger-dark text-white px-3 py-1 rounded-lg transition duration-300">
                            <i class="fas fa-trash-alt mr-1"></i> Delete
                        </button>
                    </div>
                `;
    placesList.appendChild(card);
  });
}

// Render pagination controls
function renderPagination() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPlaces = places;

  if (searchTerm) {
    filteredPlaces = places.filter(
      (place) =>
        place.name.toLowerCase().includes(searchTerm) ||
        place.description.toLowerCase().includes(searchTerm) ||
        place.category.name.toLowerCase().includes(searchTerm)
    );
  }

  const totalPages = Math.ceil(filteredPlaces.length / placesPerPage);
  const pagination = document.getElementById("paginationControls");

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = "";

  // Previous button
  html += `<button onclick="changePage(${currentPage - 1})" ${
    currentPage === 1 ? "disabled" : ""
  } class="px-3 py-1 rounded-lg ${
    currentPage === 1
      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
  }">`;
  html += '<i class="fas fa-chevron-left"></i>';
  html += "</button>";

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    html += `<button onclick="changePage(${i})" class="px-3 py-1 rounded-lg ${
      currentPage === i
        ? "bg-primary text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }">${i}</button>`;
  }

  // Next button
  html += `<button onclick="changePage(${currentPage + 1})" ${
    currentPage === totalPages ? "disabled" : ""
  } class="px-3 py-1 rounded-lg ${
    currentPage === totalPages
      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
  }">`;
  html += '<i class="fas fa-chevron-right"></i>';
  html += "</button>";

  pagination.innerHTML = html;
}

// Change page
function changePage(page) {
  currentPage = page;
  renderPlaces();
  renderPagination();
}

// Edit a place (pre-fill form)
function editPlace(id) {
  const place = places.find((p) => p.id === id);
  if (!place) return;

  document.getElementById("placeId").value = place.id;
  document.getElementById("name").value = place.name;
  document.getElementById("category").value = place.category.name;
  document.getElementById("description").value = place.description;
  document.getElementById("imageUrls").value = place.imageUrls.join(", ");

  formTitle.textContent = `Edit Place: ${place.name}`;
  submitBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Update Place';

  // Scroll to form
  document
    .querySelector(".lg\\:col-span-1")
    .scrollIntoView({ behavior: "smooth" });
}

// Soft delete a place (set disabled: true)
async function softDeletePlace(id) {
  if (
    confirm(
      "Are you sure you want to delete this place? It will be hidden in the UI but retained in the API."
    )
  ) {
    try {
      showLoading();
      await deletePlace(id);

      // Remove from local state
      places = places.filter((p) => p.id !== id);

      renderPlaces();
      renderPagination();

      showNotification(
        "Place deleted successfully. It has been hidden from the UI.",
        "success"
      );
    } catch (error) {
      console.error("Error deleting place:", error);
      showNotification("Failed to delete place. Please try again.", "error");
    } finally {
      hideLoading();
    }
  }
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("placeId").value;
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const imageUrls = document
    .getElementById("imageUrls")
    .value.split(",")
    .map((url) => url.trim());

  const placeData = {
    name,
    category: { name: category },
    description,
    imageUrls,
    openHours: "Open 24 hours",
    entryFee: 0.0,
    latitude: 0.0,
    longitude: 0.0,
    location: "0,0",
    disabled: false,
  };

  try {
    showLoading();

    if (id) {
      // Update existing place
      const updatedPlace = await updatePlace(id, placeData);

      // Update local state
      const index = places.findIndex((p) => p.id === parseInt(id));
      if (index !== -1) {
        places[index] = updatedPlace;
      }

      showNotification("Place updated successfully!", "success");
    } else {
      // Create new place
      const newPlace = await createPlace(placeData);

      // Add to local state
      places.unshift(newPlace);

      showNotification("Place created successfully!", "success");
    }

    // Reset form and re-render places
    resetForm();
    renderPlaces();
    renderPagination();
  } catch (error) {
    console.error("Error saving place:", error);
    showNotification("Failed to save place. Please try again.", "error");
  } finally {
    hideLoading();
  }
}

// Reset form
function resetForm() {
  placeForm.reset();
  document.getElementById("placeId").value = "";
  formTitle.textContent = "Add New Place";
  submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Save Place';
}

// Show notification
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-semibold transform transition-all duration-300 ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }`;
  notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${
                      type === "success"
                        ? "fa-check-circle"
                        : "fa-exclamation-circle"
                    } mr-2"></i>
                    ${message}
                </div>
            `;

  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Show loading indicator
function showLoading() {
  placesContainer.classList.add("hidden");
  noResultsMessage.classList.add("hidden");
  loadingIndicator.classList.remove("hidden");
}

// Hide loading indicator
function hideLoading() {
  loadingIndicator.classList.add("hidden");
}

// Show error message
function showError(message) {
  placesContainer.classList.add("hidden");
  loadingIndicator.classList.add("hidden");
  noResultsMessage.classList.remove("hidden");
  noResultsMessage.innerHTML = `
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-600">Error Loading Data</h3>
                <p class="text-gray-500 mt-2">${message}</p>
                <button onclick="fetchPlaces()" class="mt-4 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                    <i class="fas fa-redo mr-2"></i> Try Again
                </button>
            `;
}

// Set up event listeners
function setupEventListeners() {
  placeForm.addEventListener("submit", handleFormSubmit);
  resetBtn.addEventListener("click", resetForm);
  refreshBtn.addEventListener("click", fetchPlaces);
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderPlaces();
    renderPagination();
  });
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);

// Expose functions to global scope for button onclick handlers
window.editPlace = editPlace;
window.softDeletePlace = softDeletePlace;
window.changePage = changePage;
