import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBMbEupVHZXduK7Kixt7l_FbDHPAPYNTdI",
    authDomain: "hexa-304d9.firebaseapp.com",
    projectId: "hexa-304d9",
    storageBucket: "hexa-304d9.firebasestorage.app",
    messagingSenderId: "919569150365",
    appId: "1:919569150365:web:c47e58b72d3b65916c7f74"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Meotodo Auto-guard-admin
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "../admin-panel/";
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));

        if (!userDoc.exists()) {
            await signOut(auth);
            window.location.href = "../";
            return;
        }

        const userData = userDoc.data();

        if (userData.rol !== "admin") {
            await signOut(auth);
            window.location.href = "../";
            return;
        }

        console.log("Admin autorizado:", userData.nombre);
        cargarClinicas();
        cargarClinicasEnSelect();
        cargarUsuarios();

    } catch (error) {
        console.error(error);
        await signOut(auth);
        window.location.href = "../";
    }
});

// Tabs
const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        sections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// --------- CLINICAS GENERAL GESTION --------- //

// CLINICAS CARGAR
async function cargarClinicas() {
    try {
        const querySnapshot = await getDocs(collection(db, "clinicas"));

        const tbody = document.getElementById("tabla-clinicas");
        tbody.innerHTML = "";

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${data.nombre || ""}</td>
                <td>${data.nif || ""}</td>
                <td>${data.telefono || ""}</td>
                <td>
                    <select class="select-estado" data-id="${docSnap.id}">
                        <option value="Activa" ${data.estado === "Activa" ? "selected" : ""}>Activa</option>
                        <option value="Inactiva" ${data.estado === "Inactiva" ? "selected" : ""}>Inactiva</option>
                    </select>
                </td>
            `;

            tbody.appendChild(tr);

            // 🔹 Listener directo para actualizar Firestore al cambiar
            const select = tr.querySelector(".select-estado");
            select.addEventListener("change", async () => {
                const idClinica = select.dataset.id;
                const nuevoEstado = select.value;

                try {
                    await updateDoc(doc(db, "clinicas", idClinica), {
                        estado: nuevoEstado
                    });
                    console.log(`Estado de ${idClinica} actualizado a ${nuevoEstado}`);
                } catch (err) {
                    console.error("Error actualizando estado:", err);
                }
            });
        });

    } catch (error) {
        console.error("Error cargando clínicas:", error);
    }
}

// CLINICAS AÑADIR
const formCrear = document.getElementById("formCrearClinica");
formCrear.addEventListener("submit", async (e) => {
    e.preventDefault();

    const idClinica = document.getElementById("inputIdClinica").value.trim();
    const nombre = document.getElementById("inputNombre").value.trim();
    const nif = document.getElementById("inputNif").value.trim();
    const telefono = document.getElementById("inputTelefono").value.trim();
    const estado = document.getElementById("selectEstado").value;

    if (!idClinica || !nombre) {
        alert("ID y Nombre son obligatorios");
        return;
    }

    try {
        await setDoc(doc(db, "clinicas", idClinica), {
            nombre,
            nif,
            telefono,
            estado
        });

        alert("Clínica creada correctamente!");

        formCrear.reset();

        cargarClinicas();

    } catch (err) {
        console.error("Error creando clínica:", err);
        alert("Error creando clínica. Revisa la consola.");
    }
});

// --------- USUARIOS GENERAL GESTION --------- //

// USUARIOS CARGAR
async function cargarUsuarios() {
    try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));

        const tbody = document.getElementById("tabla-usuarios");
        tbody.innerHTML = "";

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${data.nombre || ""}</td>
                <td>${data.clinica || ""}</td>
                <td>${data.rol || ""}</td>
                <td>${data.estado || ""}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error cargando usuarios:", error);
    }
}

// CARGAR CLINICAS SELECT
async function cargarClinicasEnSelect() {
    try {
        const select = document.getElementById("selectClinicas");

        if (!select) return;

        select.innerHTML = '<option value="">...</option>';

        const q = query(
            collection(db, "clinicas"),
            where("estado", "==", "Activa")
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();

            const option = document.createElement("option");
            option.value = docSnap.id;
            option.textContent = data.nombre;

            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error cargando clínicas:", error);
    }
}

//AÑADIR USUARIOS
const formCrearUsuario = document.getElementById("formCrearUsuario");
formCrearUsuario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const uid = document.getElementById("inputUid").value.trim();
    const nombre = document.getElementById("inputNombreUsuario").value.trim();
    const clinica = document.getElementById("selectClinicas").value;
    const rol = document.getElementById("selectRol").value || "usuario";

    try {
        const userRef = doc(db, "usuarios", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            alert("Este UID ya está registrado.");
            return;
        }

        // 🔥 Crear usuario con estado automático
        await setDoc(userRef, {
            nombre: nombre,
            clinica: clinica,
            rol: rol,
            estado: "habilitado"
        });

        alert("Usuario registrado correctamente");

        formCrearUsuario.reset();
        cargarUsuarios();

    } catch (error) {
        console.error("Error creando usuario:", error);
        alert("Error al registrar usuario.");
    }
});

// --------- PACIENTES GESTION --------- //

// CARGAR DOM
const formEliminarPaciente = document.getElementById("form-eliminar-paciente");
const tbodyPacientes = document.getElementById("pacientes-table-body");
formEliminarPaciente.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pacienteId = document.getElementById("input-paciente-id").value.trim();
    const clinicaId = document.getElementById("input-clinica-id").value.trim();

    if (!pacienteId || !clinicaId) {
        alert("Por favor, introduce ambos IDs.");
        return;
    }

    const paciente = await obtenerPaciente(clinicaId, pacienteId);
    if (!paciente) return;

    mostrarPacienteEnTabla(paciente, clinicaId);
});

async function obtenerPaciente(clinicaId, idPersonalizado) {
    try {
        const pacientesRef = collection(db, "clinicas", clinicaId, "pacientes");

        const q = query(pacientesRef, where("id", "==", Number(idPersonalizado)));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("Paciente no encontrado.");
            return null;
        }

        const pacienteDoc = querySnapshot.docs[0];

        return {
            uid: pacienteDoc.id,  // 🔥 ID REAL del documento (para eliminar)
            ...pacienteDoc.data()
        };

    } catch (error) {
        console.error("Error al obtener paciente:", error);
        alert("Error al obtener paciente.");
        return null;
    }
}

function mostrarPacienteEnTabla(paciente, clinicaId) {

    tbodyPacientes.innerHTML = "";

    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td>${clinicaId}</td>
    <td>${paciente.nombre}</td>
    <td>${paciente.id}</td>
    <td>
      <button class="btn btn-delete btn-eliminar">
        Eliminar
      </button>
    </td>
  `;

    tbodyPacientes.appendChild(tr);

    // --------- BOTÓN ELIMINAR ---------
    tr.querySelector(".btn-eliminar").addEventListener("click", async () => {

        const confirmado = confirm(
            `¿Seguro que quieres eliminar el paciente con ID ${paciente.id}?`
        );

        if (!confirmado) return;

        try {

            await deleteDoc(
                doc(db, "clinicas", clinicaId, "pacientes", paciente.uid)
            );

            alert("Paciente eliminado con éxito.");

            // Limpiar interfaz
            tbodyPacientes.innerHTML = "";
            formEliminarPaciente.reset();

        } catch (error) {
            console.error("Error al eliminar paciente:", error);
            alert("Error al eliminar paciente.");
        }
    });
}