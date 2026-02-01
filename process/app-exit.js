// ====================== IMPORTAR FIREBASE ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// ====================== CONFIGURACIÓN DEL PROYECTO ======================
const firebaseConfig = {
  apiKey: "AIzaSyBMbEupVHZXduK7Kixt7l_FbDHPAPYNTdI",
  authDomain: "hexa-304d9.firebaseapp.com",
  projectId: "hexa-304d9",
  storageBucket: "hexa-304d9.firebasestorage.app",
  messagingSenderId: "919569150365",
  appId: "1:919569150365:web:c47e58b72d3b65916c7f74"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ====================== BOTONES DE SALIDA ======================

// Mostrar confirmación de salida
document.getElementById('salir-btn').addEventListener('click', () => {
    document.getElementById('confirmacion-salida').style.display = 'flex';
});

// Confirmar cierre de sesión
document.getElementById('cerrar-btn').addEventListener('click', async () => {
    try {
        await signOut(auth);  // 🔑 Cerrar sesión en Firebase
        window.location.href = '../index.html'; // Redirigir al login
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("No se pudo cerrar sesión. Inténtalo de nuevo.");
    }
});

// Mantener sesión
document.getElementById('mantener-btn').addEventListener('click', () => {
    document.getElementById('confirmacion-salida').style.display = 'none';
});

