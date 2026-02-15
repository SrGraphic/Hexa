# HEXA - Gestión Web 🏥

**HEXA** es una aplicación web desarrollada como TFG para **Desarrollo de Aplicaciones Web (DAW)**.  
Su objetivo es facilitar la gestión en clínicas médicas mediante una plataforma **sencilla, segura y accesible desde cualquier navegador**.

---

### 📄 [Ver manual de uso]()

### 🌐  [Lanzar APP](https://srgraphic.github.io/Hexa/)

### 🗄️ Sistema de Base de Datos (Firebase)
```
<Firebase Authentication>
   └── Login email/contraseña
````
````
<Firestore Database-Colección 1: usuarios>

usuarios
 └── {uid}
        ├── nombre: "nombreUsuario"
        ├── clinica: "nombreClinica"
````
````
<Firestore Database-Colección 2: clinicas>

clinicas
 └── nombreClinica
        ├── nombre: "Clínica A"
        ├── activa: true
        │
        ├── pacientes (subcolección)
        │      └── pacienteId
        │
        ├── agenda (subcolección)
        │      └── citaId

````
<br>

![Licencia](https://img.shields.io/badge/license-srgraphic-lightgrey) ![Desarollo](https://img.shields.io/badge/version-v0.5.2-blue)

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="20"/> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" width="20"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" width="20"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg" width="20"/>

###### 02/02/2026 By SrGraphic 
