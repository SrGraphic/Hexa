// BOTÓN SALIR //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
const auth = getAuth(app);

// modal-salida
document.getElementById('salir-btn').addEventListener('click', () => {
    document.getElementById('confirmacion-salida').style.display = 'flex';
});

//caso-cerrar-sesion
document.getElementById('cerrar-btn').addEventListener('click', async () => {
    try {
        await signOut(auth); // confirmar-cierra-firebase
        window.location.href = '../index.html';
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("No se pudo cerrar sesión. Inténtalo de nuevo.");
    }
});

// caso-mantener-sesion
document.getElementById('mantener-btn').addEventListener('click', () => {
    document.getElementById('confirmacion-salida').style.display = 'none';
});
