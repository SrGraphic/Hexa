// PACIENTES //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Firebase-config
const firebaseConfig = {
  apiKey: "AIzaSyBMbEupVHZXduK7Kixt7l_FbDHPAPYNTdI",
  authDomain: "hexa-304d9.firebaseapp.com",
  projectId: "hexa-304d9",
  storageBucket: "hexa-304d9.firebasestorage.app",
  messagingSenderId: "919569150365",
  appId: "1:919569150365:web:c47e58b72d3b65916c7f74"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


let clinicaActualGlobal;
// Método-auto-guard-deslogin //
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '../index.html';
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, "usuarios", user.uid));
    if (!userDoc.exists()) throw new Error("Usuario no encontrado en Firestore");

    const userData = userDoc.data();
    clinicaActualGlobal = userData.clinica;

    // función-carga-pacientes
    getPacientes(clinicaActualGlobal);

  } catch (error) {
    console.error(error);
    alert("Error al obtener datos del usuario registrado.");
  }
});

// FUNCIÓN OBTENER PACIENTES //
async function getPacientes(clinica) {
  try {
    const querySnapshot = await getDocs(
      collection(db, "clinicas", clinica, "pacientes")
    );

    const pacientes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    pacientes.sort((a, b) => a.nombre.localeCompare(b.nombre));
    displayPatients(pacientes);

  } catch (error) {
    console.error("Error al obtener pacientes:", error);
  }
}

// FUNCION PINTADO DATOS //
function displayPatients(data) {
  const tableBody = document.getElementById('pacienteTableBody');
  tableBody.innerHTML = '';
  const limitedData = data.slice(0, 8); // mostrar máximo 8 filas

  limitedData.forEach(paciente => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${paciente.id}</td>
      <td>${paciente.nombre}</td>
      <td>${paciente.apellidos}</td>
      <td>${paciente.fecha_nacimiento}</td>
      <td>${paciente.telefono}</td>
      <td>${paciente.localidad || ''}</td>
      <td class="sx"><i class='icons fa-solid fa-book' data-id="${paciente.id}"></i></td>
    `;
    tableBody.appendChild(row);
  });

  // accion-modificar-paciente
  const iconElements = document.querySelectorAll('.fa-book');
  iconElements.forEach(icon => {
    icon.addEventListener('click', () => {
      const pacienteId = icon.getAttribute('data-id');
      redirectToUpdatePacientePage(pacienteId);
    });
  });

  document.getElementById('totalResults').textContent = 'Resultados totales: ' + data.length;
}

function redirectToUpdatePacientePage(pacienteId) {
  window.location.href = `actualizar_paciente.html?id=${pacienteId}`;
}

// CUADRO BÚSQUEDA //
window.searchClient = async function () {
  const searchInputEl = document.getElementById('searchInput');
  if (!searchInputEl) return;

  const searchInput = searchInputEl.value.toLowerCase();

  if (!clinicaActualGlobal) {
    console.error("No hay clínica conectada para el usuario");
    return;
  }

  try {
    const querySnapshot = await getDocs(
      collection(db, "clinicas", clinicaActualGlobal, "pacientes")
    );

    const pacientes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // filtrado-busqueda-pacientes
    const filteredData = pacientes.filter(paciente =>
      (paciente.nombre?.toLowerCase().includes(searchInput)) || //por nombre
      (paciente.apellidos?.toLowerCase().includes(searchInput)) || //por apellido
      (paciente.localidad?.toLowerCase().includes(searchInput)) // por localidad
    );

    displayPatients(filteredData);

  } catch (error) {
    console.error("Error al buscar pacientes:", error); //captura error busqueda
  }
};
