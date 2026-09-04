let admin = document.getElementById("admin-login-form");
let doctor = document.getElementById("doctor-login-form");

admin.addEventListener("submit", admin_login);
doctor.addEventListener("submit", doctor_login);



//admin login 
async function admin_login(e) {
  e.preventDefault();

  let a_email = document.getElementById("a-email").value;
  let a_password = document.getElementById("a-password").value;
  console.log(a_email);
  console.log(a_password);

  let login_data = {
    email: "admin@gmail.com",
    password: "admin123",
  };
  console.log(login_data);

  try {
    if (a_email !== login_data.email || a_password !== login_data.password) {
      alert("Invalid email or password");
      admin.reset();
      return;
    }
    alert("Login successful!");

    localStorage.setItem("admin", JSON.stringify(login_data));

    admin.reset();
    window.location.href = "/frontend/admin/html/index.html";
  } catch (error) {
    console.log(error);
  }
}



//doctor login

async function doctor_login(e) {
  e.preventDefault();

  let d_email = document.getElementById("d-email").value;

  let login_data = {
    email: d_email,
  };

  console.log(login_data);

  try {
    let response = await fetch(`http://hospital-appointment-system-s9z1.onrender.com/doctor/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login_data),
    });
    console.log(response);

    let data = await response.json();
    console.log(data);
    
    localStorage.setItem("doctor", JSON.stringify(data));

    console.log(data);
    if (response.status === 200) {
      alert("Login successful!");
      doctor.reset();
      window.location.href = "/frontend/doctor/html/index.html";
    }else{

    alert(data.message);
      doctor.reset();


    }
  } catch (error) {
    console.log(error);
  }
}
