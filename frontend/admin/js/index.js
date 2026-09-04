let tbody = document.querySelector("#available tbody");
let total_appointment = document.querySelector(".total-appointment");
let today_appointment = document.querySelector(".today-appointment");

let patient_by_age = document.querySelector(".patient-by-age");

document.addEventListener("DOMContentLoaded", patient_age_group);

document.addEventListener("DOMContentLoaded", available_doctors);
document.addEventListener("DOMContentLoaded", total_appointment_count);

let app_tbody = document.querySelector(".appointment-list tbody");

let l_admin = localStorage.getItem("admin");

if (!l_admin) {
  window.location.href = "/frontend/admin/html/login.html";
}


//patient by the age group
async function patient_age_group() {
  try {
    let response = await fetch(
      "http://localhost:3000/admin/patients/age_group",
    );

    let data = await response.json();

    if (!response.ok) {
      alert(data.message);
    }

    patient_by_age.innerHTML = `<h2>Patients by Age</h2>${data
      .map(
        (i) => `<p class='age'><b>${i.age_group}</b>--> ${i.patient_count}</p>`,
      )
      .join("")}`;
  } catch (err) {
    console.log(err);
  }
}

//total appointment count
async function total_appointment_count() {
  try {
    let get_data = await fetch(
      "http://localhost:3000/admin/book_appointment/get",
    );
    let appointment_data = await get_data.json();

    total_appointment.innerHTML = `<h2>Total Appointments</h2><h1>${appointment_data[0].total}</h1>`;

    let response = await fetch(
      "http://localhost:3000/admin/book_appointment/app_list",
    );
    let app_list = await response.json();

    app_tbody.innerHTML = app_list
      .map((i) => {
        return `<tr>
          <td>${i.appointment_time}</td> 
          <td>${i.patient_name}</td>
          <td>${i.doctor_name}</td>
          <td>${i.status}</td>
          <td><button class="book-btn">View Details</button></td>
        </tr>`;
      })
      .join("");
  } catch (err) {
    console.log(err);
  }
}


//available doctors
async function available_doctors(e) {
  let patient = JSON.parse(localStorage.getItem("patient"));

  e.preventDefault();
  try {
    let response = await fetch(
      "http://localhost:3000/patients/book_appointment",
    );
    let data = await response.json();
    console.log(data);

    tbody.innerHTML = data.map((i) => {
        return `<tr>
          <td>${i.doctor_name}</td> 
          <td>${i.dept_name}</td>
          <td>${i.available_date.slice(0, 10)}</td>
          <td>${i.available_time}</td>
          <td>${i.status}</td>
          <td><button class="book-btn" onclick='book_appointment()' >Book Appointment</button></td>
        </tr>`;
      })
      .join("");
  } catch (err) {
    console.log(err);
  }
}
