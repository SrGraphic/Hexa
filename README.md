# HEXA - Gestión Web

Software de Gestion Web dedicado a clinicas medicas
-

### 📄 [Ver manual de uso]()

### SISTEMA DB - FIREBASE
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

![Licencia](https://img.shields.io/badge/license-srgraphic-lightgrey) ![Desarollo](https://img.shields.io/badge/version-v0.2.5-blue)

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="20"/> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" width="20"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" width="20"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg" width="20"/>

###### 01/02/2025 By SrGraphic 
