import { getData } from '../store/fetchApi.js';
import { locationDetailsComponent } from '../components/locationComponent.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch all places from the API
    const cards = await getData('places');
    console.log('Fetched data:', cards);

    // Get the "id" from URL parameters
    const params = new URLSearchParams(window.location.search);
    const uuid = decodeURIComponent(params.get('placeUuid'));
    console.log("uuid", uuid);
    

    if (!uuid) {
      alert('No place ID in URL');
      return;
    }

    // Find the specific place (fix: use === not =)
    const place = cards.find((p) => String(p.uuid) === String(uuid));

    const locationDetail = document.querySelector('#location');

    if (!place) {
      locationDetail.innerHTML = '<h2>Place not found</h2>';
      return;
    }

    // Render the location details
    locationDetail.innerHTML = locationDetailsComponent(place);

    // Create map if lat/lng exist
    if (place.lat && place.lng) {
      const map = L.map('map').setView([Number(place.lat), Number(place.lng)], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(map);

      // Add marker for the place
      L.marker([Number(place.lat), Number(place.lng)])
        .addTo(map)
        .bindPopup(`<b>${place.name}</b><br>${place.description}`)
        .openPopup();
    } else {
      console.warn('Latitude/Longitude not found for this place.');
    }
  } catch (error) {
    console.error('Error loading place details:', error);
  }
});
