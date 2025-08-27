"use strict";
const API_BASE = "https://derleng-api.eunglyzhia.social/api/v1";
let selectedFiles = [];

const imageInput = document.getElementById("images");
const imagePreview = document.getElementById("imagePreview");
const form = document.getElementById("placeForm");
const statusDiv = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

// Handle file selection
imageInput.addEventListener("change", function (e) {
  const files = Array.from(e.target.files);
  selectedFiles = files;
  displayImagePreviews();
});

function displayImagePreviews() {
  imagePreview.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewDiv = document.createElement("div");
      previewDiv.className = "preview-image";
      previewDiv.innerHTML = `
                        <img src="${e.target.result}" alt="Preview ${
        index + 1
      }">
                        <button type="button" class="remove-image" onclick="removeImage(${index})">×</button>
                    `;
      imagePreview.appendChild(previewDiv);
    };
    reader.readAsDataURL(file);
  });
}

function removeImage(index) {
  selectedFiles.splice(index, 1);
  displayImagePreviews();
}

function showStatus(message, type) {
  statusDiv.innerHTML = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = "block";
}

async function uploadImages() {
  if (selectedFiles.length === 0) {
    return [];
  }

  const formData = new FormData();
  selectedFiles.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await fetch(`${API_BASE}/upload/multiple`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Upload response:", result);

    // Handle different possible response structures
    // Expected format: URLs like "https://tos-der.sokpheng.com/images/43149900-9b2c-4987-ab31-19724acaae43.png"
    if (result.urls && Array.isArray(result.urls)) {
      return result.urls;
    } else if (result.data && Array.isArray(result.data.urls)) {
      return result.data.urls;
    } else if (Array.isArray(result)) {
      // If response is directly an array of URLs
      return result;
    } else if (result.files && Array.isArray(result.files)) {
      // If response has files array, extract URLs
      return result.files.map((f) => f.url || f.path || f.filename);
    } else if (result.images && Array.isArray(result.images)) {
      // If response has images array
      return result.images.map((img) => img.url || img.path || img);
    } else {
      console.warn("Unexpected upload response structure:", result);
      // Try to extract any URLs from the response
      const possibleUrls = Object.values(result)
        .flat()
        .filter(
          (val) =>
            typeof val === "string" &&
            val.includes("tos-der.sokpheng.com/images/")
        );
      return possibleUrls.length > 0 ? possibleUrls : [];
    }
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
}

async function createPlace(placeData) {
  try {
    const response = await fetch(`${API_BASE}/places`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(placeData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Place creation failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();
    console.log("Place creation response:", result);
    return result;
  } catch (error) {
    console.error("Place creation error:", error);
    throw error;
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  submitBtn.disabled = true;
  showStatus('<div class="loading-spinner"></div>Processing...', "loading");

  try {
    // Step 1: Upload images if any
    let imageUrls = [];
    if (selectedFiles.length > 0) {
      showStatus(
        '<div class="loading-spinner"></div>Uploading images...',
        "loading"
      );
      imageUrls = await uploadImages();
      console.log("Uploaded image URLs:", imageUrls);
    }

    const names = imageUrls.map((developer) => developer.uri);

    console.log("Uploaded image:", names);
    // Step 2: Prepare place data
    const formData = new FormData(form);
    const placeData = {
      name: formData.get("name"),
      description: formData.get("description"),
      openHours: formData.get("openHours"),
      entryFee: parseFloat(formData.get("entryFee")) || 0.0,
      imageUrls: names,
      location: formData.get("location"),
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
      categoryName: formData.get("categoryName"),
    };

    console.log("Sending place data:", placeData);

    // Step 3: Create place
    showStatus(
      '<div class="loading-spinner"></div>Creating place...',
      "loading"
    );
    const result = await createPlace(placeData);

    showStatus(
      `✅ Place created successfully! ${
        imageUrls.length > 0
          ? `Uploaded ${imageUrls.length} image(s).`
          : "No images uploaded."
      }`,
      "success"
    );

    // Reset form
    form.reset();
    selectedFiles = [];
    imagePreview.innerHTML = "";

    // Restore default values
    document.getElementById("name").value = "ជីផាត់-ទេសចរណ៍ធម្មជាតិ- កោះកុង";
    document.getElementById("description").value =
      "ជាកោដើរលេងក្នុងព្រៃ ជិះទូកកាយ៉ាក់ ជិះកង់ឡើងភ្នំ និង មើលសត្វព្រៃ។";
    document.getElementById("openHours").value = "Open 24h";
    document.getElementById("entryFee").value = "0.00";
    document.getElementById("location").value = "10.7131,103.2343";
    document.getElementById("latitude").value = "00.00";
    document.getElementById("longitude").value = "00.00";
    document.getElementById("categoryName").value = "Phnom";
  } catch (error) {
    console.error("Operation failed:", error);
    showStatus(`❌ Error: ${error.message}`, "error");
  } finally {
    submitBtn.disabled = false;
  }
});

// Drag and drop functionality
const fileUpload = document.querySelector(".file-upload");

fileUpload.addEventListener("dragover", function (e) {
  e.preventDefault();
  fileUpload.style.background = "rgba(102, 126, 234, 0.2)";
});

fileUpload.addEventListener("dragleave", function (e) {
  e.preventDefault();
  fileUpload.style.background = "rgba(102, 126, 234, 0.05)";
});

fileUpload.addEventListener("drop", function (e) {
  e.preventDefault();
  fileUpload.style.background = "rgba(102, 126, 234, 0.05)";

  const files = Array.from(e.dataTransfer.files).filter((file) =>
    file.type.startsWith("image/")
  );
  if (files.length > 0) {
    selectedFiles = files;
    displayImagePreviews();
  }
});
