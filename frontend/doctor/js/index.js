let app_tbody = document.querySelector(".appointment-list tbody");
let search = document.getElementById("search");

let edit_form = document.getElementById('edit-input')


let doctor = JSON.parse(localStorage.getItem("doctor"));
if(!doctor){
    window.location.href = '/admin/html/login.html'
}

document.addEventListener("DOMContentLoaded", load_appointments);


search.addEventListener("input", search_appointment);
edit_form.addEventListener("submit", save_appointment);


async function load_appointments() {
  try {
    let doctor = JSON.parse(localStorage.getItem("doctor"));

    let response = await fetch(
      `https://hospital-appointment-system-s9z1.onrender.com/doctor/load-appointment/${doctor.id}`,
    );

    let data = await response.json();

    console.log(data);

    app_tbody.innerHTML = data
      .map((i) => {
        let date = i.appointment_date.slice(0, 10);
        let time = i.appointment_time.slice(0, 5);
        return `<tr>
          <td>${date}</td> 
          <td>${time}</td>
          <td>${i.patient_name}</td>
          <td>${i.doctor_name}</td>
          <td><button id='edit' onclick='edit_appointment(${i.id}, ${JSON.stringify(date)}, ${JSON.stringify(time)})'>Edit</button>
           <button id='delete' onclick='delete_appointment(${i.id})'>Delete</button></td>
        </tr>`})
      .join("");

  } catch (err) {
    console.log(err);
  }
}


async function edit_appointment(id,date,time) {
  
  edit_form.dataset.appointmentId = id;
  document.getElementById('date').value = date;
  document.getElementById('time').value = time;
  edit_form.style.display = 'block';
}

async function save_appointment(e) {
  e.preventDefault();

  try {
    let response = await fetch(
      `https://hospital-appointment-system-s9z1.onrender.com/doctor/update-appointment/${edit_form.dataset.appointmentId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_date: document.getElementById('date').value,
          appointment_time: document.getElementById('time').value,
        }),
      },
    );

    let data = await response.json();
    if (!response.ok) {
    return'Unable to update appointment';
    }

    alert(data.message);

    edit_form.style.display = 'none';
    load_appointments();


  } catch (err) {
    console.log(err);
    alert(err.message);
  }

}



async function delete_appointment(id) {
  console.log(id);
  try {
    let response = await fetch(
      `https://hospital-appointment-system-s9z1.onrender.com/doctor/delete-appointment/${id}`,
      {
        method: "DELETE",
      },
    );

    let data = await response.json();

    console.log(data);

    alert("Appointment Deleted!!!");
    load_appointments();
  } catch (err) {
    console.log(err);
  }
}

async function search_appointment() {

    try{
        let value = search.value;
    let doctor = JSON.parse(localStorage.getItem("doctor"));
    
    let response = await fetch(`https://hospital-appointment-system-s9z1.onrender.com/doctor/search-appointment?search=${encodeURIComponent(value)}&doctor_id=${doctor.id}`)

    let data = await response.json()

    console.log(data);
   
    
    app_tbody.innerHTML = data
      .map((i) => {
        let date = i.appointment_date.slice(0, 10);
        let time = i.appointment_time.slice(0, 5);
        return `<tr>
          <td>${date}</td> 
          <td>${time}</td>
          <td>${i.patient_name}</td>
          <td>${i.doctor_name}</td>
          <td><button id='edit' onclick='edit_appointment(${i.id}, ${JSON.stringify(date)}, ${JSON.stringify(time)})'>Edit</button> <button id='delete' onclick='delete_appointment(${i.id})'>Delete</button></td>
        </tr>`})
      .join("");

    }catch(err){
        console.log(err);
        
    }
  


}
