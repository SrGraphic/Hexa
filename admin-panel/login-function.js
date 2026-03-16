// LOGIN ADMIN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('usuario').value.trim();
  const password = document.getElementById('codigo').value.trim();

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const userDoc = await getDoc(doc(db, "usuarios", uid));

    if (!userDoc.exists()) {
      await signOut(auth);
      throw new Error("Usuario no registrado en Firestore");
    }

    const userData = userDoc.data();

    // 🔐 Verificamos que sea ADMIN
    if (userData.rol !== "admin") {
      await signOut(auth);
      alert("No tienes permisos de administrador");
      return;
    }

    // ✅ Login correcto
    alert(`Bienvenido Admin ${userData.nombre}`);
    window.location.href = './admin-panel.html';

  } catch (error) {
    console.error(error);
    alert("Correo o contraseña incorrectos");
  }
});