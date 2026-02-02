//CREAR PACIENTES//
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
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
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

let clinicaActual = null;
// Método-auto-guard-deslogin //
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (!userDoc.exists()) throw new Error("Usuario sin clínica");

        clinicaActual = userDoc.data().clinica;

    } catch (error) {
        console.error(error);
        alert("Error, no se pudo obtener la clínica.");
    }
});

// CREAR NUEVO PACIENTE //
document.getElementById('addPatientForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!clinicaActual) {
        alert("Error, no existe la clínica.");
        return;
    }

    try {
        const pacientesRef = collection(db, "clinicas", clinicaActual, "pacientes");

        // Obtencion de ID secuencial.
        const q = query(pacientesRef, orderBy("id", "desc"), limit(1));
        const snap = await getDocs(q);

        let nuevoId = 1;
        if (!snap.empty) {
            nuevoId = snap.docs[0].data().id + 1;
        }

        // valores-tabla
        const newPatient = {
            id: nuevoId,
            nombre: input_name.value.trim(),
            apellidos: input_subname.value.trim(),
            genero: genero.value,
            email: input_email.value.trim(),
            telefono: input_phone.value.trim(),
            telefono_2: input_phone_2.value.trim(),
            fecha_nacimiento: convertirFecha(input_date.value),
            direccion: input_address.value.trim(),
            localidad: input_locality.value.trim(),
            medicacion_actual: medicacion_actual.value.trim(),
            observaciones: observaciones.value.trim()
        };

        await addDoc(pacientesRef, newPatient);

        alert("Paciente guardado correctamente");
        document.getElementById('addPatientForm').reset();

    } catch (error) {
        console.error("Error al crear paciente:", error);
        alert("Error al guardar el paciente");
    }
});

// Parse-de-la-fecha_nacimiento //
function convertirFecha(fecha) {
    if (!fecha) return "";
    const [año, mes, dia] = fecha.split("-");
    return `${dia}-${mes}-${año}`;
}
