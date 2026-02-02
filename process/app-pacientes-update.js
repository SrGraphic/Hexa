//MODIFICAR PACIENTES//
// Funcion-cambiar-imagen-genero
function changeImage() {
  const genderSelect = document.getElementById('genero');
  const genderImage = document.getElementById('genderImage');
  const selectedGender = genderSelect.value.trim();

  if (selectedGender === 'hombre') {
    genderImage.src = '../assets/hombre.png';
  } else if (selectedGender === 'mujer') {
    genderImage.src = '../assets/mujer.png';
  } else if (selectedGender === 'otro') {
    genderImage.src = '../assets/otro.png';
  }
}

window.changeImage = changeImage;

// Firebase-config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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

let clinicaActual = null; //sigue usando clinica login
let pacienteRef = null;
// Método-auto-guard-deslogin //
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '../index.html';
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, "usuarios", user.uid));// clinica-login-usuario
    clinicaActual = userDoc.data().clinica;

    const params = new URLSearchParams(window.location.search);
    const pacienteId = Number(params.get("id"));

    if (!pacienteId) {
      alert("ID de paciente no válido");
      return;
    }

    const pacientesRef = collection(db, "clinicas", clinicaActual, "pacientes");
    const q = query(pacientesRef, where("id", "==", pacienteId));
    const snap = await getDocs(q);

    if (snap.empty) {
      alert("Error, paciente no encontrado");
      return;
    }

    const docSnap = snap.docs[0];
    pacienteRef = docSnap.ref;
    const data = docSnap.data();

    // FUNCION PINTADO DATOS //
    nombre.value = data.nombre;
    apellidos.value = data.apellidos;
    genero.value = data.genero;
    changeImage();
    email.value = data.email;
    telefono.value = data.telefono;
    telefono_2.value = data.telefono_2 || "";
    fecha_nacimiento.value = convertirFechaAInput(data.fecha_nacimiento);
    direccion.value = data.direccion;
    localidad.value = data.localidad;
    medicacion_actual.value = data.medicacion_actual || "";
    observaciones.value = data.observaciones || "";

  } catch (error) {
    console.error(error);
    alert("Error cargando el paciente");
  }
});

// Confirmar-guardar-actualizacion
document.getElementById("formActualizarPaciente").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!pacienteRef) return;

  const [año, mes, dia] = fecha_nacimiento.value.split("-");
  const fechaFormateada = `${dia}-${mes}-${año}`;

  const updatedPaciente = {
    nombre: nombre.value.trim(),
    apellidos: apellidos.value.trim(),
    genero: genero.value,
    email: email.value.trim(),
    telefono: telefono.value.trim(),
    telefono_2: telefono_2.value.trim(),
    fecha_nacimiento: fechaFormateada,
    direccion: direccion.value.trim(),
    localidad: localidad.value.trim(),
    medicacion_actual: medicacion_actual.value.trim(),
    observaciones: observaciones.value.trim()
  };

  try {
    await updateDoc(pacienteRef, updatedPaciente);
    alert("Paciente actualizado correctamente");

  } catch (error) {
    console.error("Error al actualizar:", error);
    alert("Error al guardar cambios");
  }
});

// Parse-de-la-fecha_nacimiento //
function convertirFechaAInput(fechaStr) {
  if (!fechaStr) return "";
  const [dia, mes, año] = fechaStr.split("-");
  return `${año}-${mes}-${dia}`;
}
