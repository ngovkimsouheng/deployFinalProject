"use strict";

// API URLs
const LOGIN_API = "https://tos-der.sokpheng.com/api/v1/auth/login";
const REGISTER_API = "https://tos-der.sokpheng.com/api/v1/auth/register";

// ================ Form switching =======================
const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
  clearMessages();
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
  clearMessages();
});

// ================ Utility Functions =======================
function validateField(field, errorElement, validationFn, errorMessage) {
  const value = field.value.trim();
  const isValid = validationFn(value);

  if (!isValid && errorElement) {
    field.classList.add("error");
    errorElement.textContent = errorMessage;
    errorElement.classList.add("show");
  } else if (errorElement) {
    field.classList.remove("error");
    errorElement.textContent = "";
    errorElement.classList.remove("show");
  }

  return isValid;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

function isValidUsername(username) {
  return username.length >= 3;
}

function clearMessages() {
  document.querySelectorAll(".error-message").forEach((msg) => {
    msg.classList.remove("show");
    msg.textContent = "";
  });
  document.querySelectorAll(".success-message").forEach((msg) => {
    msg.classList.remove("show");
    msg.textContent = "";
  });
  document.querySelectorAll("input").forEach((input) => {
    input.classList.remove("error");
  });
}

function showSuccess(elementId, message) {
  const successElement = document.getElementById(elementId);
  if (successElement) {
    successElement.textContent = message;
    successElement.classList.add("show");
  }
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add("show");
  }
}

function setLoading(buttonId, isLoading) {
  const button = document.getElementById(buttonId);
  if (isLoading) {
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span>Processing...';
  } else {
    button.disabled = false;
    if (buttonId === "loginBtn") {
      button.innerHTML = "ចូលគណនី";
    } else {
      button.innerHTML = "Register";
    }
  }
}

// ================ In-Memory Storage =======================
let userData = null;
let isLoggedIn = false;

function saveUserData(data) {
  userData = data;
  isLoggedIn = true;
}

function getUserData() {
  return userData;
}

function clearUserData() {
  userData = null;
  isLoggedIn = false;
}

// ================ API Functions =======================
async function loginUser(username, password) {
  try {
    console.log("Attempting login with:", { username, password: "***" });

    const response = await fetch(LOGIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    console.log("Login response status:", response.status);

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      return {
        success: false,
        message: "Invalid server response",
      };
    }

    console.log("Login response data:", data);

    if (response.ok && data) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message:
          data?.message ||
          data?.error ||
          "Login failed. Please check your credentials.",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

async function registerUser(username, firstname, lastname, email, password) {
  try {
    console.log("Attempting registration with:", {
      username,
      firstname,
      lastname,
      email,
      password: "***",
    });

    const response = await fetch(REGISTER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      }),
    });

    console.log("Registration response status:", response.status);

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      return {
        success: false,
        message: "Invalid server response",
      };
    }

    console.log("Registration response data:", data);

    if (response.ok && data) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message:
          data?.message ||
          data?.error ||
          "Registration failed. Please try again.",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

// ================ Login form handling =======================
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername");
    const password = document.getElementById("loginPassword");
    const usernameError = document.getElementById("loginUsernameError");
    const passwordError = document.getElementById("loginPasswordError");

    // Clear previous messages
    clearMessages();

    let isValid = true;

    // Validate username
    if (
      !validateField(
        username,
        usernameError,
        isValidUsername,
        "Username must be at least 3 characters long"
      )
    ) {
      isValid = false;
    }

    // Validate password
    if (
      !validateField(
        password,
        passwordError,
        isValidPassword,
        "Password must be at least 6 characters long"
      )
    ) {
      isValid = false;
    }

    if (isValid) {
      setLoading("loginBtn", true);

      const result = await loginUser(username.value.trim(), password.value);

      setLoading("loginBtn", false);

      if (result.success) {
        // Save user data
        saveUserData(result.data);

        showSuccess("loginSuccess", "Login successful! Redirecting...");

        setTimeout(() => {
          // In a real environment, you would redirect to the index page
          alert("Login successful! You would be redirected to the main page.");
          window.location.href = "../index.html";
        }, 1500);
      } else {
        showError("loginPasswordError", result.message);
      }
    }
  });

// ================ Register form handling =======================
document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("registerUsername");
    const firstname = document.getElementById("registerFirstname");
    const lastname = document.getElementById("registerLastname");
    const email = document.getElementById("registerEmail");
    const password = document.getElementById("registerPassword");
    const usernameError = document.getElementById("registerUsernameError");
    const emailError = document.getElementById("registerEmailError");
    const passwordError = document.getElementById("registerPasswordError");

    // Clear previous messages
    clearMessages();

    let isValid = true;

    // Validate username
    if (
      !validateField(
        username,
        usernameError,
        isValidUsername,
        "Username must be at least 3 characters long"
      )
    ) {
      isValid = false;
    }

    // Validate email
    if (
      !validateField(
        email,
        emailError,
        isValidEmail,
        "Please enter a valid email address"
      )
    ) {
      isValid = false;
    }

    // Validate password
    if (
      !validateField(
        password,
        passwordError,
        isValidPassword,
        "Password must be at least 6 characters long"
      )
    ) {
      isValid = false;
    }

    if (isValid) {
      setLoading("registerBtn", true);

      const result = await registerUser(
        username.value.trim(),
        firstname.value.trim(),
        lastname.value.trim(),
        email.value.trim(),
        password.value
      );

      setLoading("registerBtn", false);

      if (result.success) {
        showSuccess(
          "registerSuccess",
          "Registration successful! You can now login."
        );

        // Clear form
        username.value = "";
        firstname.value = "";
        lastname.value = "";
        email.value = "";
        password.value = "";

        // Switch to login form after 2 seconds
        setTimeout(() => {
          container.classList.remove("active");
          clearMessages();
        }, 2000);
      } else {
        showError("registerUsernameError", result.message);
      }
    }
  });

// ================ Real-time validation =======================
document.getElementById("loginUsername").addEventListener("blur", function () {
  const usernameError = document.getElementById("loginUsernameError");
  validateField(
    this,
    usernameError,
    isValidUsername,
    "Username must be at least 3 characters long"
  );
});

document.getElementById("loginPassword").addEventListener("blur", function () {
  const passwordError = document.getElementById("loginPasswordError");
  validateField(
    this,
    passwordError,
    isValidPassword,
    "Password must be at least 6 characters long"
  );
});

document
  .getElementById("registerUsername")
  .addEventListener("blur", function () {
    const usernameError = document.getElementById("registerUsernameError");
    validateField(
      this,
      usernameError,
      isValidUsername,
      "Username must be at least 3 characters long"
    );
  });

document.getElementById("registerEmail").addEventListener("blur", function () {
  const emailError = document.getElementById("registerEmailError");
  validateField(
    this,
    emailError,
    isValidEmail,
    "Please enter a valid email address"
  );
});

document
  .getElementById("registerPassword")
  .addEventListener("blur", function () {
    const passwordError = document.getElementById("registerPasswordError");
    validateField(
      this,
      passwordError,
      isValidPassword,
      "Password must be at least 6 characters long"
    );
  });
