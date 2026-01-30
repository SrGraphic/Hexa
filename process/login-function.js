// IMPORTAR FIREBASE //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCrv2BiybqKcI8cLsm-3qt8u_FgKf-QY8U",
  authDomain: "nexa-db-93fdd.firebaseapp.com",
  projectId: "nexa-db-93fdd",
  storageBucket: "nexa-db-93fdd.appspot.com",
  messagingSenderId: "1011655429895",
  appId: "1:1011655429895:web:cfc1dc4a57776b64febfa2",
  measurementId: "G-EB761FYEX0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// LOGIN //
document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const clinica = document.getElementById('clinica').value;
  const usuario = document.getElementById('usuario').value;
  const codigo = document.getElementById('codigo').value;

  try {
    const snapshot = await getDocs(collection(db, "clinicasID", clinica, "usuarios"));
    const usuarios = snapshot.docs.map(doc => doc.data());

    const usuarioValido = usuarios.find(
      user => user.nombre === usuario && user.codigo === codigo
    );

    if (usuarioValido) {
      alert(`▪︎ Bienvenido, ${usuario}! a ${clinica}`);

      localStorage.setItem('usuarioConectado', usuario);
      localStorage.setItem('clinicaConectada', clinica);

      window.location.href = '#';
    } else {
      alert('▪︎ Clinica, usuario o código incorrectos.');
    }
  } catch (error) {
    console.error(error);
    alert('Error al conectarse con la base de datos.');
  }
});
