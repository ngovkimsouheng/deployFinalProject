"use strict";

const API_BASE = "https://derleng-api.eunglyzhia.social/api/v1";
let allPlaces = [];
let selectedPlace = null;

const searchInput = document.getElementById("searchInput");
const placesList = document.getElementById("placesList");
const loadPlacesBtn = document.getElementById("loadPlacesBtn");
const selectedPlaceInfo = document.getElementById("selectedPlaceInfo");
const placeDetails = document.getElementById("placeDetails");
const deleteForm = document.getElementById("deleteForm");
const confirmInput = document.getElementById("confirmInput");
const deleteBtn = document.getElementById("deleteBtn");
const statusDiv = document.getElementById("status");

// Load all places
loadPlacesBtn.addEventListener("click", async function () {
  await loadPlaces();
});

// Search functionality
searchInput.addEventListener("input", function (e) {
  const query = e.target.value.toLowerCase();
  filterPlaces(query);
});

// Confirmation input validation
confirmInput.addEventListener("input", function (e) {
  const isValid = e.target.value === "DELETE" && selectedPlace;
  deleteBtn.disabled = !isValid;
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
    // Handle different possible response structures
    allPlaces = result.data || result.places || result || [];

    displayPlaces(allPlaces);
    placesList.classList.remove("hidden");
    loadPlacesBtn.innerHTML = "ផ្ទុកកន្លែងឡើងវិញ";

    showStatus(`✅ Loaded ${allPlaces.length} places`, "success");
  } catch (error) {
    console.error("Error loading places:", error);
    showStatus(`❌ Error loading places: ${error.message}`, "error");
  } finally {
    loadPlacesBtn.disabled = false;
  }
}

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

  // Update form
  document.getElementById("placeId").value = place.id || "";

  // Show place details
  placeDetails.innerHTML = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Name:</strong> ${place.name || "N/A"}
            </div>
            <div>
              <strong>Category:</strong> ${place.categoryName || "N/A"}
            </div>
            <div>
              <strong>Entry Fee:</strong> $${place.entryFee || 0}
            </div>
            <div>
              <strong>Location:</strong> ${place.location || "N/A"}
            </div>
            <div class="md:col-span-2">
              <strong>Description:</strong> ${place.description || "N/A"}
            </div>
            <div>
              <strong>Open Hours:</strong> ${place.openHours || "N/A"}
            </div>
            <div>
              <strong>Images:</strong> ${
                (place.imageUrls && place.imageUrls.length) || 0
              } image(s)
            </div>
          </div>
        `;

  selectedPlaceInfo.classList.remove("hidden");

  // Reset confirmation
  confirmInput.value = "";
  deleteBtn.disabled = true;

  showStatus(`Selected: ${place.name}`, "info");
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

// Delete form submission
deleteForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!selectedPlace || confirmInput.value !== "DELETE") {
    showStatus("❌ Please select a place and confirm deletion", "error");
    return;
  }

  deleteBtn.disabled = true;
  showStatus('<div class="loading-spinner"></div>Deleting place...', "loading");

  try {
    const placeUuid = selectedPlace.uuid;

    const response = await fetch(
      `https://derleng-api.eunglyzhia.social/api/v1/places/${placeUuid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Delete response status:", response.status);
    console.log("Delete response headers:", [...response.headers.entries()]);

    if (!response.ok) {
      let errorMessage = `Delete failed: ${response.status} ${response.statusText}`;

      try {
        const errorData = await response.json();
        console.log("Error response:", errorData);

        // Handle common error scenarios
        if (response.status === 500) {
          if (errorData.message && errorData.message.includes("constraint")) {
            errorMessage =
              "Cannot delete: This place might be referenced by other records (bookings, reviews, etc.). Please check dependencies first.";
          } else if (errorData.message) {
            errorMessage = `Server error: ${errorData.message}`;
          } else {
            errorMessage =
              "Server error occurred. The place might have related data that prevents deletion.";
          }
        } else if (response.status === 404) {
          errorMessage = "Place not found. It might have already been deleted.";
        } else if (response.status === 403) {
          errorMessage =
            "Access denied. You don't have permission to delete this place.";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (jsonError) {
        // If error response is not JSON, use text
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += ` - ${errorText}`;
          }
        } catch (textError) {
          console.error("Could not parse error response", textError);
        }
      }

      throw new Error(errorMessage);
    }

    // Check if response has content
    let result = null;
    try {
      const responseText = await response.text();
      if (responseText) {
        result = JSON.parse(responseText);
      }
    } catch (e) {
      // Response might be empty, which is fine for DELETE
    }

    showStatus(
      `✅ Place "${selectedPlace.name}" deleted successfully!`,
      "success"
    );

    // Reset form
    deleteForm.reset();
    selectedPlace = null;
    selectedPlaceInfo.classList.add("hidden");

    // Reload places
    await loadPlaces();
  } catch (error) {
    console.error("Delete error:", error);
    showStatus(`❌ ${error.message}`, "error");
  } finally {
    deleteBtn.disabled = false;
  }
});

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
    case "info":
      statusDiv.classList.add(
        "bg-gray-100",
        "text-gray-800",
        "border",
        "border-gray-300"
      );
      break;
  }

  statusDiv.style.display = "block";

  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      statusDiv.style.display = "none";
    }, 5000);
  }
}

// Auto-load places on page load
window.addEventListener("load", function () {
  loadPlaces();
});
