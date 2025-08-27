"use strict";

const API_BASE = "https://derleng-api.eunglyzhia.social/api/v1";
let allPlaces = [];
let selectedPlace = null;
let categories = [];

const searchInput = document.getElementById("searchInput");
const placesList = document.getElementById("placesList");
const loadPlacesBtn = document.getElementById("loadPlacesBtn");
const updateForm = document.getElementById("updateForm");
const statusDiv = document.getElementById("status");
const cancelBtn = document.getElementById("cancelBtn");
const imagesInput = document.getElementById("images");
const imagePreview = document.getElementById("imagePreview");
const previewList = document.getElementById("previewList");

let selectedImages = [];

// Load categories and places on page load
window.addEventListener("load", async function () {
  await loadCategories();
  await loadPlaces();
});

// Image upload functionality
imagesInput.addEventListener("change", function (e) {
  selectedImages = Array.from(e.target.files);
  displayImagePreviews();
});

function displayImagePreviews() {
  if (selectedImages.length === 0) {
    imagePreview.classList.add("hidden");
    return;
  }

  imagePreview.classList.remove("hidden");
  previewList.innerHTML = "";

  selectedImages.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageDiv = document.createElement("div");
      imageDiv.className = "image-preview";
      imageDiv.innerHTML = `
              <img src="${e.target.result}" alt="Preview ${index + 1}" />
              <button type="button" class="remove-image-btn" onclick="removeImage(${index})">×</button>
            `;
      previewList.appendChild(imageDiv);
    };
    reader.readAsDataURL(file);
  });
}

function removeImage(index) {
  selectedImages.splice(index, 1);
  displayImagePreviews();

  // Update the file input
  const dt = new DataTransfer();
  selectedImages.forEach((file) => dt.items.add(file));
  imagesInput.files = dt.files;
}

// Make removeImage function global for onclick handler
window.removeImage = removeImage;

// Load categories
async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error("Failed to load categories");

    const result = await response.json();
    categories = result.data || result.categories || result || [];

    const categorySelect = document.getElementById("categoryId");
    categorySelect.innerHTML = '<option value="">ជ្រើសរើសប្រភេទ</option>';

    categories.forEach((category) => {
      categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    });
  } catch (error) {
    console.error("Error loading categories:", error);
    showStatus("❌ Failed to load categories", "error");
  }
}

// Load all places
loadPlacesBtn.addEventListener("click", async function () {
  await loadPlaces();
});

async function loadPlaces() {
  loadPlacesBtn.disabled = true;
  loadPlacesBtn.innerHTML =
    '<div class="loading-spinner"></div>Loading places...';

  try {
    const response = await fetch(`${API_BASE}/places`);
    if (!response.ok) {
      throw new Error(
        `Failed to load places: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    allPlaces = result.data || result.places || result || [];

    displayPlaces(allPlaces);
    placesList.classList.remove("hidden");
    loadPlacesBtn.innerHTML = "🔄 ផ្ទុកកន្លែងឡើងវិញ";

    showStatus(`✅ Loaded ${allPlaces.length} places`, "success");
  } catch (error) {
    console.error("Error loading places:", error);
    showStatus(`❌ Error loading places: ${error.message}`, "error");
  } finally {
    loadPlacesBtn.disabled = false;
  }
}

// Search functionality
searchInput.addEventListener("input", function (e) {
  const query = e.target.value.toLowerCase();
  filterPlaces(query);
});

function displayPlaces(places) {
  placesList.innerHTML = "";

  if (places.length === 0) {
    placesList.innerHTML =
      '<p class="text-gray-500 text-center py-4">No places found</p>';
    return;
  }

  places.forEach((place) => {
    const placeElement = document.createElement("div");
    placeElement.className =
      "place-item p-4 border-2 border-gray-200 rounded-xl cursor-pointer";
    placeElement.innerHTML = `
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800">${
                  place.name || "Unnamed Place"
                }</h3>
                <p class="text-sm text-gray-600 mt-1">${(
                  place.description || ""
                ).substring(0, 100)}${
      (place.description || "").length > 100 ? "..." : ""
    }</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">${
                    place.categoryName || "No Category"
                  }</span>
                  <span class="text-xs text-gray-500">ID: ${
                    place.id || "N/A"
                  }</span>
                </div>
              </div>
              <div class="text-right">
                <span class="text-sm text-gray-500">$${
                  place.entryFee || 0
                }</span>
              </div>
            </div>
          `;

    placeElement.addEventListener("click", () =>
      selectPlace(place, placeElement)
    );
    placesList.appendChild(placeElement);
  });
}

function selectPlace(place, element) {
  // Remove previous selection
  document.querySelectorAll(".place-item").forEach((item) => {
    item.classList.remove("selected");
  });

  // Select new place
  element.classList.add("selected");
  selectedPlace = place;

  // Populate form with place data
  populateForm(place);

  // Show update form
  updateForm.classList.remove("hidden");

  showStatus(`Selected: ${place.name}`, "info");
}

function populateForm(place) {
  // Fill form fields with current place data
  document.getElementById("placeUuid").value = place.uuid || "";
  document.getElementById("placeName").value = place.name || "";
  document.getElementById("categoryId").value = place.categoryId || "";
  document.getElementById("entryFee").value = place.entryFee || "";
  document.getElementById("location").value = place.location || "";
  document.getElementById("description").value = place.description || "";
  document.getElementById("openHours").value = place.openHours || "";
  document.getElementById("latitude").value = place.latitude || "";
  document.getElementById("longitude").value = place.longitude || "";

  // Display current images if any
  displayCurrentImages(place.imageUrls || []);

  // Reset image selection
  selectedImages = [];
  imagesInput.value = "";
  imagePreview.classList.add("hidden");
}

function displayCurrentImages(imageUrls) {
  const currentImagesDiv = document.getElementById("currentImages");
  const imagesListDiv = document.getElementById("imagesList");

  if (imageUrls.length > 0) {
    currentImagesDiv.classList.remove("hidden");
    imagesListDiv.innerHTML = "";

    imageUrls.forEach((imageUrl, index) => {
      const imageDiv = document.createElement("div");
      imageDiv.className = "image-preview";
      imageDiv.innerHTML = `
              <img src="${imageUrl}" alt="Place image ${index + 1}" />
            `;
      imagesListDiv.appendChild(imageDiv);
    });
  } else {
    currentImagesDiv.classList.add("hidden");
  }
}

function filterPlaces(query) {
  if (!query) {
    displayPlaces(allPlaces);
    return;
  }

  const filtered = allPlaces.filter(
    (place) =>
      (place.name || "").toLowerCase().includes(query) ||
      (place.description || "").toLowerCase().includes(query) ||
      (place.categoryName || "").toLowerCase().includes(query)
  );

  displayPlaces(filtered);
}

// Cancel button
cancelBtn.addEventListener("click", function () {
  updateForm.classList.add("hidden");
  selectedPlace = null;
  document.querySelectorAll(".place-item").forEach((item) => {
    item.classList.remove("selected");
  });
  showStatus("", "");
});

// Update form submission
updateForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!selectedPlace) {
    showStatus("❌ Please select a place to update", "error");
    return;
  }

  const updateBtn = document.getElementById("updateBtn");
  updateBtn.disabled = true;
  showStatus('<div class="loading-spinner"></div>Updating place...', "loading");

  try {
    // Always use JSON approach since your API expects raw JSON with PATCH
    const response = await updateWithJSON();

    if (!response.ok) {
      let errorMessage = `Update failed: ${response.status} ${response.statusText}`;

      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // Use default error message
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Update result:", result);

    // Handle image upload separately if images are selected
    if (selectedImages.length > 0) {
      try {
        await uploadImages();
        showStatus(
          `✅ Place "${selectedPlace.name}" and images updated successfully!`,
          "success"
        );
      } catch (imageError) {
        console.error("Image upload failed:", imageError);
        showStatus(
          `✅ Place updated successfully, but image upload failed: ${imageError.message}`,
          "warning"
        );
      }
    } else {
      showStatus(
        `✅ Place "${selectedPlace.name}" updated successfully!`,
        "success"
      );
    }

    // Reset form and reload places
    updateForm.classList.add("hidden");
    selectedPlace = null;
    selectedImages = [];
    imagesInput.value = "";
    imagePreview.classList.add("hidden");
    await loadPlaces();
  } catch (error) {
    console.error("Update error:", error);
    showStatus(`❌ ${error.message}`, "error");
  } finally {
    updateBtn.disabled = false;
  }
});

// Update with JSON (matching your API structure)
async function updateWithJSON() {
  const updateData = {};

  // Map form fields to API fields
  const fieldMapping = {
    placeName: "name",
    categoryId: "categoryId",
    entryFee: "entryFee",
    location: "location",
    description: "description",
    openHours: "openHours",
    latitude: "latitude",
    longitude: "longitude",
  };

  Object.keys(fieldMapping).forEach((formField) => {
    const element = document.getElementById(formField);
    const value = element.value;
    const apiField = fieldMapping[formField];

    if (value && value.trim() !== "") {
      if (
        formField === "entryFee" ||
        formField === "latitude" ||
        formField === "longitude"
      ) {
        updateData[apiField] = parseFloat(value);
      } else if (formField === "categoryId") {
        updateData[apiField] = parseInt(value);
      } else {
        updateData[apiField] = value;
      }
    }
  });

  console.log("Updating place with JSON:", updateData);

  // Use PATCH method with JSON content type (as shown in your API docs)
  const response = await fetch(`${API_BASE}/places/${selectedPlace.uuid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  return response;
}

// Separate image upload function
async function uploadImages() {
  if (selectedImages.length === 0) return;

  console.log("Uploading images separately...");

  const imageFormData = new FormData();
  selectedImages.forEach((file) => {
    imageFormData.append("images", file);
  });

  // Try different image upload endpoints
  const imageEndpoints = [
    `${API_BASE}/places/${selectedPlace.uuid}/images`,
    `${API_BASE}/places/${selectedPlace.uuid}/upload-images`,
    `${API_BASE}/upload/places/${selectedPlace.uuid}`,
    `${API_BASE}/places/images/${selectedPlace.uuid}`,
    `${API_BASE}/upload-files/places/${selectedPlace.uuid}`,
  ];

  let lastError;
  for (const endpoint of imageEndpoints) {
    try {
      console.log(`Trying image upload to: ${endpoint}`);
      const imageResponse = await fetch(endpoint, {
        method: "POST",
        body: imageFormData,
      });

      if (imageResponse.ok) {
        console.log("Image upload successful");
        return;
      } else {
        lastError = `${imageResponse.status} ${imageResponse.statusText}`;
      }
    } catch (error) {
      console.log(`Failed to upload to ${endpoint}:`, error);
      lastError = error.message;
    }
  }

  throw new Error(lastError || "All image upload endpoints failed");
}

function showStatus(message, type) {
  statusDiv.innerHTML = message;
  statusDiv.className = `mt-5 p-4 rounded-lg`;

  switch (type) {
    case "success":
      statusDiv.classList.add(
        "bg-green-100",
        "text-green-800",
        "border",
        "border-green-300"
      );
      break;
    case "error":
      statusDiv.classList.add(
        "bg-red-100",
        "text-red-800",
        "border",
        "border-red-300"
      );
      break;
    case "loading":
      statusDiv.classList.add(
        "bg-blue-100",
        "text-blue-800",
        "border",
        "border-blue-300"
      );
      break;
    case "warning":
      statusDiv.classList.add(
        "bg-yellow-100",
        "text-yellow-800",
        "border",
        "border-yellow-300"
      );
      break;
    case "info":
      statusDiv.classList.add(
        "bg-gray-100",
        "text-gray-800",
        "border",
        "border-gray-300"
      );
      break;
  }

  statusDiv.style.display = message ? "block" : "none";

  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      statusDiv.style.display = "none";
    }, 5000);
  }
}
