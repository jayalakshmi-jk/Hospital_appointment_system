let login_form = document.getElementById("login-form");

login_form.addEventListener("submit", patient_login);



async function patient_login(e) {
  e.preventDefault();

  let p_email = document.getElementById("email").value;
  let p_password = document.getElementById("password").value;

  let login_data = {
    email: p_email,
    password: p_password,
  };

  console.log(login_data);

  try {
    let response = await fetch(`http://hospital-appointment-system-s9z1.onrender.com/patients/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login_data),
    });

    let data = await response.json();
    localStorage.setItem("patient", JSON.stringify(data));

    console.log(data);
    if (response.status === 200) {
      alert("Login successful!");
      login_form.reset();
      window.location.href = "index.html";
    } else {
      alert(data.message || "Login failed. Please try again.");
    }
  } catch (error) {
    console.log(error);
  }
}
let patient = localStorage.getItem("patient");

if (patient) {
  window.location.href = "index.html";
}