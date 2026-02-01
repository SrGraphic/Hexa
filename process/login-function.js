// LOGIN //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);


document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('usuario').value.trim(); // email
  const codigo = document.getElementById('codigo').value.trim(); // contraseña
  const clinicaSeleccionada = document.getElementById('clinica').value;

  const auth = getAuth();

  try {
    const cred = await signInWithEmailAndPassword(auth, email, codigo);
    const uid = cred.user.uid;

    const userDoc = await getDoc(doc(db, "usuarios", uid));

    if (!userDoc.exists()) {
      throw new Error("Usuario no registrado en el sistema HexaGM");
    }

    const userData = userDoc.data();

    // verificacion01-clinica
    if (userData.clinica !== clinicaSeleccionada) {
      alert("Organización incorrecta o fuera del sistema");
      await auth.signOut();
      return;
    }

    // Final-login
    alert(`Bienvenido, ${userData.nombre}! a ${clinicaSeleccionada}`);
    window.location.href = './pages/pacientes.html';

  } catch (error) {
    console.error(error);
    alert('Usuario o contraseña incorrectos');
  }
});
