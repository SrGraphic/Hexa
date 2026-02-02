// FACTURAS //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDoc, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
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

// Paginación
let currentPage = 1;
const rowsPerPage = 7;

let clinicaActualGlobal = null;
let facturaActualId = null;
let valoresFactura = [];
// Método-auto-guard-deslogin //
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "usuarios", user.uid));
  if (!userDoc.exists()) return;

  clinicaActualGlobal = userDoc.data().clinica;
  listenFacturas();
});

// Listado-facturas
function listenFacturas() {
  const list = document.getElementById("listadoFacturas");

  onSnapshot(
    collection(db, "clinicas", clinicaActualGlobal, "facturas"),
    (snapshot) => {
      list.innerHTML = "";

      snapshot.forEach(docSnap => {
        const data = docSnap.data();

        const div = document.createElement("div");
        div.className = "factura";
        div.dataset.id = docSnap.id;

        if (docSnap.id === facturaActualId) {
          div.classList.add("active");
        }

        div.innerHTML = `
          <strong>${data.fecha || ""}</strong><br>
          ${(data.total ?? 0).toFixed(2)} €
        `;

        div.onclick = () => {
          facturaActualId = docSnap.id;
          marcarFacturaActiva(docSnap.id);
          loadFactura();
        };

        list.appendChild(div);
      });
    }
  );
}

function marcarFacturaActiva(id) {
  document.querySelectorAll(".factura").forEach(el => {
    el.classList.remove("active");
  }); //funcion porporcion (solo para marcar la activa en azul)

  const activa = document.querySelector(`.factura[data-id="${id}"]`);
  if (activa) activa.classList.add("active");
}

// Carga-factura-listado
async function loadFactura() {
  if (!facturaActualId) return;

  const ref = doc(
    db,
    "clinicas",
    clinicaActualGlobal,
    "facturas",
    facturaActualId
  );

  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  valoresFactura = data.items || [];

  document.getElementById("facturaTitulo").textContent = "Factura";
  document.getElementById("facturaFecha").value = data.fecha || "";

  currentPage = 1;
  renderItems();
}

// Nueva-factura
window.newInvoice = async function () {
  const fecha =
    document.getElementById("facturaFecha").value ||
    new Date().toISOString().split("T")[0];

  const docRef = await addDoc(
    collection(db, "clinicas", clinicaActualGlobal, "facturas"),
    {
      fecha,
      items: [],
      total: 0,
      creadaEn: serverTimestamp()
    }
  );

  facturaActualId = docRef.id;
  valoresFactura = [];

  document.getElementById("facturaTitulo").textContent = "Factura";
  document.getElementById("facturaFecha").value = fecha;

  renderItems();
};

// Pintar-valores-tabla
function renderItems() {
  const table = document.getElementById("itemsTable");
  table.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  valoresFactura.slice(start, end).forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.cantidadfact}</td>
      <td class="space-custom">
        <button class="deleteButtonFatc" onclick="removeItem(${start + index})">
          <i class="fa-solid fa-x"></i>
        </button>
      </td>
    `;
    table.appendChild(tr);
  });

  renderPagination();
}

window.addItem = async function () {
  if (!facturaActualId) {
    alert("Primero crea una factura");
    return;
  }

  const name = document.getElementById("nombreEntrada").value.trim();
  const cantidadfact = Number(document.getElementById("cantidadEntrada").value);

  if (!name || !cantidadfact) return;

  valoresFactura.push({ name, cantidadfact });
  currentPage = Math.ceil(valoresFactura.length / rowsPerPage);

  await saveFactura();

  document.getElementById("nombreEntrada").value = "";
  document.getElementById("cantidadEntrada").value = "";
};

window.removeItem = async function (index) {
  valoresFactura.splice(index, 1);

  const totalPages = Math.ceil(valoresFactura.length / rowsPerPage);
  if (currentPage > totalPages) currentPage = totalPages || 1;

  await saveFactura();
};

// Guardar-factura
async function saveFactura() {
  const total = valoresFactura.reduce((s, i) => s + i.cantidadfact, 0);
  const fecha = document.getElementById("facturaFecha").value;

  await updateDoc(
    doc(db, "clinicas", clinicaActualGlobal, "facturas", facturaActualId),
    {
      items: valoresFactura,
      total,
      fecha
    }
  );

  renderItems();
}

// Eliminar-factura
window.deleteInvoice = async function () {
  if (!facturaActualId) return;

  await deleteDoc(
    doc(db, "clinicas", clinicaActualGlobal, "facturas", facturaActualId)
  );

  facturaActualId = null;
  valoresFactura = [];

  document.getElementById("facturaTitulo").textContent =
    "Selecciona una factura";
  document.getElementById("facturaFecha").value = "";
  document.getElementById("itemsTable").innerHTML = "";

  marcarFacturaActiva(null);
};

// PAGINACION TABLA //
function renderPagination() {
  const totalPages = Math.ceil(valoresFactura.length / rowsPerPage) || 1;
  document.getElementById("pageInfo").textContent =
    `Página ${currentPage} de ${totalPages}`;
}

window.nextPage = function () {
  const totalPages = Math.ceil(valoresFactura.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderItems();
  }
};

window.prevPage = function () {
  if (currentPage > 1) {
    currentPage--;
    renderItems();
  }
};