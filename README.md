# HEXA - Gestión Web

<img width="1000" height="130" alt="image" src="https://github.com/user-attachments/assets/c2db8aad-2f8a-4c8a-b04c-106b1ec88f5a" /><br>

**HEXA** es una aplicación web desarrollada como TFG para **Desarrollo de Aplicaciones Web (DAW)**.  
Su objetivo es facilitar la gestión en clínicas médicas mediante una plataforma **sencilla, segura y accesible desde cualquier navegador**.

---
![Licencia](https://img.shields.io/badge/license-srgraphic-lightgrey) ![Desarollo](https://img.shields.io/badge/version-v0.6.0-blue)
![HTML](https://img.shields.io/badge/html5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/css3-1572B6?style=flat&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/firebase-FFCA28?style=flat&logo=firebase&logoColor=black)

### 🔗 Enlaces útiles

  <a href="./CHANGELOG.md">
    <img src="https://img.shields.io/badge/Changelog-Historial_de_versiones-6f42c1?style=for-the-badge&logo=read-the-docs" />
  </a>
  <br><br>
  <a href="#">
    <img src="https://img.shields.io/badge/Manual-Ver_Manual_De_Uso-4DBA23?style=for-the-badge&logo=google-docs" />
  </a>
  <br><br>
  <a href="https://srgraphic.github.io/Hexa/">
    <img src="https://img.shields.io/badge/Web App-Lanzar_app_demo-0A66C2?style=for-the-badge&logo=google-chrome" />
  </a>

---

### 🗄️ Sistema de Base de Datos (Firebase)
```
<Firebase Authentication>
   └── Login email/contraseña


<Firestore Database-Colección 1: usuarios>
usuarios
 └── {uid}
        ├── nombre: "nombreUsuario"
        ├── clinica: "nombreClinica"


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
### 📅 Próximas Incorporaciones

| Librería | Descripción |
|----------|------------|
| SweetAlert2 | Implementación de modales personalizables para reemplazar alertas nativas y mejorar la experiencia de usuario. |
| TomSelect | Mejora de campos select con búsqueda, autocompletado y multiselección para formularios más dinámicos. |

###### 15/02/2026 By SrGraphic 
