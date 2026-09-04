let register = document.getElementById("register-form");


register.addEventListener("submit", patient_register);

async function patient_register(e) {
  e.preventDefault();

    let p_name = document.getElementById("name").value;
  let p_email = document.getElementById("email").value;
  let p_password = document.getElementById("password").value;
  let gender = document.getElementById("gender").value;


  let age = document.getElementById("age").value;
  let ph_no = document.getElementById("phno").value;
 
  let address = document.getElementById("address").value;

  let new_patient = {
    patient_name: p_name,
    email: p_email,
    password: p_password,
    age: age,
    gender:gender,
    phone_no: ph_no,
    address: address,
  };

  console.log(new_patient);
  
  try {
    let response = await fetch(`https://hospital-appointment-system-s9z1.onrender.com/patients/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_patient),
    });

    let data = await response.json();

    if (response.status === 409) {
      alert(data.message); // check the patient already exists
      return;
    }

    console.log(data);
    alert("Register successfully!!!!!");
    register.reset();
    window.location.href = "login.html";

  } catch (error) {
    console.log(error);
   
  }
}
