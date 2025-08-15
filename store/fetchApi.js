const BASE_URL = "https://tos-der.sokpheng.com/api/v1/";

// Get data from API
export async function getData(endpoint) {
    try {
        const res = await fetch(BASE_URL + endpoint);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        return data.data || data; // Some APIs wrap in { data: [...] }
    } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        return [];
    }
}

// Generic post data function
export async function postData(endpoint, payload) {
    try {
        const response = await fetch(BASE_URL + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Data saved successfully:", result);
        
        // Different success messages based on endpoint
        if (endpoint.includes('feedback') || endpoint.includes('review')) {
            console.log("Feedback submitted successfully!");
        } else if (endpoint.includes('product')) {
            alert("Product created successfully!");
        } else {
            console.log("Data submitted successfully!");
        }
        
        return result;
    } catch (error) {
        console.error("Error submitting data:", error);
        
        // Different error messages based on endpoint
        if (endpoint.includes('feedback') || endpoint.includes('review')) {
            throw new Error("Failed to submit feedback. Please try again.");
        } else if (endpoint.includes('product')) {
            alert("Failed to create product.");
        } else {
            throw new Error("Failed to submit data.");
        }
    }
}

// Specific function for posting feedback
export async function postFeedback(feedbackData) {
    try {
        const response = await fetch(BASE_URL + "feedbacks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(feedbackData),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Feedback submitted successfully:", result);
        return result;
    } catch (error) {
        console.error("Error submitting feedback:", error);
        throw error;
    }
}