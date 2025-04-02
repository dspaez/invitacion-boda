# Invitación de Boda

Bienvenido/a al repositorio de la invitación digital interactiva para nuestra boda. Este proyecto fue creado con amor y dedicación, combinando diseño elegante y funcionalidades modernas para brindar una experiencia única a nuestros invitados.

## ✨ Características principales

- ✅ Confirmación de asistencia (RSVP) con código personalizado
- 🖼️ Galería dinámica animada, cargada desde Firebase Storage
- 🎶 Formulario para sugerencia de canciones favoritas
- 🗺️ Mapas interactivos con direcciones a la ceremonia y fiesta
- 📱 Diseño responsive adaptado a cualquier dispositivo
- ⚡ Animaciones suaves con AOS.js y carrusel automático

---

## 🧾 Tecnologías utilizadas

- HTML5, CSS3, JavaScript ES6
- Tailwind CSS
- Firebase Hosting, Firestore y Storage
- Lightbox2 (galería)
- Animate on Scroll (AOS.js)
- Git y GitHub para control de versiones

---

## 📁 Estructura del proyecto

```plaintext
/public
│
├── assets/                # Imágenes, íconos, decoraciones
├── css/                   # Estilos personalizados
├── js/
│   ├── main.js            # Lógica principal del sitio (modular)
│   └── firebase-config.js # Configuración Firebase (ignorado en .gitignore)
├── index.html             # Página principal
└── ...
```

---

## 🚀 Despliegue en Firebase

> Este proyecto está desplegado manualmente desde el entorno local.

### Pasos para desplegar (una vez configurado Firebase en tu máquina):

```bash
firebase login
firebase init hosting   # Solo la primera vez
firebase deploy
```

El sitio se alojará en:  
📍 `https://[YOUR_PROJECT_ID].web.app`

---

## 🔐 Seguridad y claves privadas

El archivo `firebase-config.js` contiene las claves de Firebase y **no está incluido en este repositorio** por motivos de seguridad.

### Ejemplo de estructura del archivo (crearlo en `/public/js/firebase-config.js`):

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO.firebaseapp.com",
  projectId: "ID_DEL_PROYECTO",
  storageBucket: "ID_DEL_PROYECTO.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

> **Importante:** Este archivo está en `.gitignore` para evitar que sea subido accidentalmente.

---

## 📝 Autor

**Danny Santiago Páez Oscullo**  
📍 Quito, Ecuador  
👨‍💻 Desarrollador, docente e investigador.

---

## 📌 Notas finales

- Este proyecto puede ser adaptado fácilmente para otros eventos como cumpleaños, aniversarios o eventos corporativos.
- Se recomienda clonar este repositorio y personalizar estilos, imágenes y textos según cada caso.
- El diseño está optimizado para visualización rápida, ligera y elegante en dispositivos móviles.

---
