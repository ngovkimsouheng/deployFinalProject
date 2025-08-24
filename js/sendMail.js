function validateEmail() {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const emailValue = emailInput.value;

    // Simple regex for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(emailValue)) {
      emailInput.classList.remove("border-red-500");
      emailInput.classList.add("border-green-500");
      emailError.classList.add("hidden");
    } else {
      emailInput.classList.remove("border-green-500");
      emailInput.classList.add("border-red-500");
      emailError.classList.remove("hidden");
    }
  }

function sendEmail() {
  emailjs.init("YCEj5uYSiDLN71K45");
  var params = {
      email : document.getElementById('email').value,
      message : document.getElementById('message').value
  }

  // Check if fields are filled
  if (!params.email || !params.message) {
    alert("Please fill in all fields before sending.");
    return;
  }

  emailjs.send('service_n692uym', 'template_hwndmx8', params).then(function (response) {
      alert('Mail sent successfully!✅');

        document.getElementById('myForm').reset();
      },
      function (error) {
        alert('Failed to send email: ' + JSON.stringify(error));
      }
    );
}