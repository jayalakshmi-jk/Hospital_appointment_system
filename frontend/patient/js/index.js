let tbody = document.querySelector("#available tbody");

document.addEventListener("DOMContentLoaded", available_doctors);



async function available_doctors(e) {
  let patient = JSON.parse(localStorage.getItem("patient"));

  e.preventDefault();
  try {
    let response = await fetch(
      "https://hospital-appointment-system-s9z1.onrender.com/patients/book_appointment",
    );
    let data = await response.json();

    tbody.innerHTML = data
      .map((i) => {
        return `<tr>
          <td>${i.doctor_name}</td> 
          <td>${i.dept_name}</td>
          <td>${i.available_date.slice(0,10)}</td>
          <td>${i.available_time}</td>
          <td>${i.status}</td>
          <td><button class="book-btn" onclick='book_appointment(${patient.id}, ${i.doctor_id})' >Book Appointment</button></td>
        </tr>`;
      })
      .join("");
  } catch (err) {
    console.log(err);
  }
}

async function book_appointment(patient_id, doctor_id) {
  if (patient_id == null || doctor_id == null) {
    return alert("invalid");
  }

  let new_appointment = {
    patient_id: patient_id,
    doctor_id: doctor_id,
  };
  try {
    let get_data = await fetch(
      "https://hospital-appointment-system-s9z1.onrender.com/patients/book_appointment/get",
    );

    let appointment_data = await get_data.json();

    console.log(appointment_data);

    let response = await fetch(
      `https://hospital-appointment-system-s9z1.onrender.com/patients/book_appointment/post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_appointment),
      },
    );

    let data = await response.json();

    if (response.status === 409) {
      alert(data.message); // check the patient already exists
      return;
    }

    console.log(data);
    alert("appointment booked!!");
  } catch (err) {
    console.log(err);
  }
}



let patient = localStorage.getItem("patient");

if (!patient) {
  window.location.href = "login.html";
}
