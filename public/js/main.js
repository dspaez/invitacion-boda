import { db, storage } from "./firebase-config.js";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

import {
  ref,
  listAll,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-storage.js";

document.addEventListener("DOMContentLoaded", () => {
  iniciarCuentaRegresiva();
  cargarGaleria();

  // Elementos
  const input = document.getElementById("codigo");
  const errorMsg = document.getElementById("error");
  const btn = document.getElementById("verificar-btn");

  const formSection = document.getElementById("form-section");
  const modal = document.getElementById("modal-invitacion");
  const cerrarModalBtn = document.getElementById("cerrar-modal");

  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpOk = document.getElementById("rsvp-ok");
  const respuestaSelect = document.getElementById("respuesta");
  const asistentesInput = document.getElementById("asistentes");
  const asistentesContainer = document.getElementById("asistentes-container");

  const resumen = document.getElementById("resumen-confirmacion");
  const respuestaGuardada = document.getElementById("respuesta-guardada");
  const asistentesGuardados = document.getElementById("asistentes-guardados");
  const asistentesGuardadosBlock = document.getElementById(
    "asistentes-guardados-block"
  );
  const editarBtn = document.getElementById("editar-respuesta");

  let codigoActual = null;
  let datosPrevios = null;

  // Mostrar modal al verificar código válido
  btn?.addEventListener("click", async () => {
    const codigo = input.value.trim().toLowerCase();

    // Si no se ingresó ningún código
    if (!codigo) {
      errorMsg.textContent =
        "⚠️ Ingresa tu código de invitación. Si no lo tienes, por favor solicítalo.";
      errorMsg.classList.remove("hidden");
      return;
    }

    // Limpia cualquier mensaje anterior
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";

    try {
      const docRef = doc(db, "invitados", codigo);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        datosPrevios = data;
        codigoActual = codigo;

        console.log(`Código válido para: ${data.nombre}`);

        modal?.classList.remove("hidden");

        const modalContent = document.getElementById("modal-content");
        if (modalContent) {
          setTimeout(() => {
            modalContent.classList.remove("opacity-0", "scale-95");
            modalContent.classList.add("opacity-100", "scale-100");
          }, 50);
        }

        if (data.respuesta) {
          if (respuestaGuardada) respuestaGuardada.textContent = data.respuesta;

          if (data.respuesta === "Sí asistiré" && data.asistentes) {
            asistentesGuardados.textContent = data.asistentes;
            asistentesGuardadosBlock.classList.remove("hidden");
          } else {
            asistentesGuardadosBlock.classList.add("hidden");
          }

          rsvpForm.classList.add("hidden");
          resumen.classList.remove("hidden");
        } else {
          resumen.classList.add("hidden");
          rsvpForm.classList.remove("hidden");
        }
      } else {
        // Código incorrecto
        errorMsg.textContent = "❌ Código incorrecto o no encontrado.";
        errorMsg.classList.remove("hidden");
      }
    } catch (err) {
      console.error("Error al verificar código:", err);
      errorMsg.textContent =
        "❗ Hubo un problema al verificar tu código. Intenta de nuevo más tarde.";
      errorMsg.classList.remove("hidden");
    }
  });

  cerrarModalBtn?.addEventListener("click", () => {
    const modalContent = document.getElementById("modal-content");
    if (modalContent) {
      modalContent.classList.add("opacity-0", "scale-95");
      modalContent.classList.remove("opacity-100", "scale-100");
      setTimeout(() => {
        modal.classList.add("hidden");
      }, 300);
    } else {
      modal.classList.add("hidden");
    }
  });

  respuestaSelect?.addEventListener("change", () => {
    const seleccion = respuestaSelect.value;
    if (seleccion === "Sí asistiré") {
      asistentesContainer.classList.remove("hidden");
      asistentesInput.setAttribute("required", "required");
    } else {
      asistentesContainer.classList.add("hidden");
      asistentesInput.removeAttribute("required");
      asistentesInput.value = "";
    }
  });

  rsvpForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const respuesta = respuestaSelect.value;
    const asistentes = parseInt(asistentesInput.value);
    const errorField = document.getElementById("rsvp-error");

    // Ocultar error anterior si lo había
    errorField.classList.add("hidden");

    // Validaciones
    if (!respuesta) {
      errorField.textContent =
        "Selecciona una opción para confirmar tu asistencia.";
      errorField.classList.remove("hidden");
      return;
    }

    if (respuesta === "Sí asistiré") {
      if (isNaN(asistentes) || asistentes <= 0) {
        errorField.textContent =
          "Por favor ingresa la cantidad de asistentes (mínimo 1).";
        errorField.classList.remove("hidden");
        return;
      }
    }

    if (!codigoActual) {
      errorField.textContent =
        "Hubo un error interno con el código. Intenta verificar nuevamente.";
      errorField.classList.remove("hidden");
      return;
    }

    const docRef = doc(db, "invitados", codigoActual);

    const dataToUpdate = {
      respuesta: respuesta,
      confirmado: respuesta === "Sí asistiré",
    };

    if (respuesta === "Sí asistiré") {
      dataToUpdate.asistentes = asistentes;
    } else {
      dataToUpdate.asistentes = null;
    }

    try {
      await updateDoc(docRef, dataToUpdate);

      respuestaGuardada.textContent = dataToUpdate.respuesta;

      if (dataToUpdate.asistentes) {
        asistentesGuardados.textContent = dataToUpdate.asistentes;
        asistentesGuardadosBlock.classList.remove("hidden");
      } else {
        asistentesGuardadosBlock.classList.add("hidden");
      }

      rsvpOk.classList.remove("hidden");
      rsvpForm.classList.add("hidden");
      resumen.classList.remove("hidden");
    } catch (error) {
      errorField.textContent = "Ocurrió un error al guardar. Intenta de nuevo.";
      errorField.classList.remove("hidden");
      console.error(error);
    }
  });

  editarBtn?.addEventListener("click", () => {
    resumen.classList.add("hidden");
    rsvpForm.classList.remove("hidden");
    rsvpOk.classList.add("hidden");

    if (datosPrevios) {
      respuestaSelect.value = datosPrevios.respuesta || "";

      if (datosPrevios.respuesta === "Sí asistiré") {
        asistentesContainer.classList.remove("hidden");
        asistentesInput.value = datosPrevios.asistentes || "";
        asistentesInput.setAttribute("required", "required");
      } else {
        asistentesContainer.classList.add("hidden");
        asistentesInput.value = "";
        asistentesInput.removeAttribute("required");
      }
    }
  });
});

// Mostrar/ocultar sección de regalos
window.mostrarRegalo = () => {
  const detalle = document.getElementById("detalle-regalo");
  if (detalle) {
    detalle.classList.toggle("hidden");
  }
};

// Cuenta regresiva visual con burbujas
function iniciarCuentaRegresiva() {
  const destino = new Date("2025-10-03T12:00:00-05:00").getTime();

  const diasEl = document.getElementById("dias");
  const horasEl = document.getElementById("horas");
  const minutosEl = document.getElementById("minutos");
  const segundosEl = document.getElementById("segundos");

  if (!diasEl || !horasEl || !minutosEl || !segundosEl) return;

  const actualizar = () => {
    const ahora = new Date().getTime();
    const diferencia = destino - ahora;

    if (diferencia <= 0) {
      diasEl.textContent = "0";
      horasEl.textContent = "00";
      minutosEl.textContent = "00";
      segundosEl.textContent = "00";
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    diasEl.textContent = dias;
    horasEl.textContent = horas.toString().padStart(2, "0");
    minutosEl.textContent = minutos.toString().padStart(2, "0");
    segundosEl.textContent = segundos.toString().padStart(2, "0");
  };

  actualizar();
  setInterval(actualizar, 1000);
}

// Galería dinámicaasync
async function cargarGaleria() {
  const galeriaRef = ref(storage, "galeria/");
  const contenedor = document.querySelector("#galeria-carrusel");

  if (!contenedor) return;

  try {
    const res = await listAll(galeriaRef);
    const urls = await Promise.all(
      res.items.map((item) => getDownloadURL(item))
    );

    let imagenes;

    if (urls.length <= 3) {
      // Si hay muy pocas, cuadruplicar
      imagenes = [...urls, ...urls, ...urls, ...urls];
    } else if (urls.length <= 6) {
      // Si hay pocas, triplicar
      imagenes = [...urls, ...urls, ...urls];
    } else {
      // Si hay muchas, duplicar es suficiente
      imagenes = [...urls, ...urls];
    }

    imagenes.forEach((url, i) => {
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("data-lightbox", "galeria");
      a.setAttribute("data-title", `Foto ${(i % urls.length) + 1}`);

      const img = document.createElement("img");
      img.src = url;
      img.alt = `Foto ${(i % urls.length) + 1}`;
      img.className = "h-64 w-auto rounded-lg shadow-md object-cover";

      a.appendChild(img);
      contenedor.appendChild(a);
    });
  } catch (error) {
    console.error("Error al cargar imágenes:", error);
  }
}

// Mostrar mapa en modal
document.querySelectorAll(".abrir-mapa").forEach((btn) => {
  btn.addEventListener("click", () => {
    const iframeUrl = btn.getAttribute("data-iframe");
    const mapsLink = btn.getAttribute("data-link");

    const iframe = document.getElementById("iframe-mapa");
    const link = document.getElementById("link-google-maps");
    const modal = document.getElementById("modal-mapa");
    const content = modal.querySelector("div");

    if (iframe && link && modal && content) {
      iframe.src = iframeUrl;
      link.href = mapsLink;
      modal.classList.remove("hidden");
      setTimeout(() => {
        content.classList.remove("opacity-0", "scale-95");
        content.classList.add("opacity-100", "scale-100");
      }, 50);
    }
  });
});

document.getElementById("cerrar-mapa")?.addEventListener("click", () => {
  const modal = document.getElementById("modal-mapa");
  const content = modal?.querySelector("div");
  const iframe = document.getElementById("iframe-mapa");

  if (modal && content && iframe) {
    content.classList.add("opacity-0", "scale-95");
    content.classList.remove("opacity-100", "scale-100");
    setTimeout(() => {
      modal.classList.add("hidden");
      iframe.src = ""; // Limpia el mapa
    }, 300);
  }
});

// Modal de música
const modalMusica = document.getElementById("modal-musica");
const modalMusicaContent = document.getElementById("modal-musica-content");
const cerrarMusica = document.getElementById("cerrar-modal-musica");
const formMusica = document.getElementById("form-musica");
const mensajeMusica = document.getElementById("mensaje-musica");

document
  .querySelector(".btn-sugerir-cancion")
  ?.addEventListener("click", () => {
    modalMusica.classList.remove("hidden");
    setTimeout(() => {
      modalMusicaContent.classList.remove("opacity-0", "scale-95");
      modalMusicaContent.classList.add("opacity-100", "scale-100");
    }, 50);
  });

cerrarMusica?.addEventListener("click", () => {
  modalMusicaContent.classList.add("opacity-0", "scale-95");
  modalMusicaContent.classList.remove("opacity-100", "scale-100");
  setTimeout(() => {
    modalMusica.classList.add("hidden");
    formMusica.reset();
    mensajeMusica.classList.add("hidden");
  }, 300);
});

// Enviar canción a Firebase
formMusica?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cancion = document.getElementById("cancion").value.trim();
  const artista = document.getElementById("artista").value.trim();

  if (!cancion || !artista) return;

  try {
    await addDoc(collection(db, "sugerencias_musicales"), {
      cancion,
      artista,
      timestamp: new Date(),
    });

    mensajeMusica.classList.remove("hidden");
    formMusica.reset();
  } catch (error) {
    console.error("Error al guardar sugerencia:", error);
    mensajeMusica.textContent = "❌ Hubo un error al guardar.";
    mensajeMusica.classList.remove("text-green-600");
    mensajeMusica.classList.add("text-red-600");
    mensajeMusica.classList.remove("hidden");
  }
});

// Modal de dress code con imagen
const modalDressCode = document.getElementById("modal-dress-code");
const modalDressCodeContent = document.getElementById(
  "modal-dress-code-content"
);
const cerrarDressCode = document.getElementById("cerrar-modal-dress-code");
const btnEntendidoDressCode = document.getElementById(
  "btn-entendido-dress-code"
);

document.querySelector(".btn-dress-code")?.addEventListener("click", () => {
  modalDressCode?.classList.remove("hidden");
  setTimeout(() => {
    modalDressCodeContent?.classList.remove("opacity-0", "scale-95");
    modalDressCodeContent?.classList.add("opacity-100", "scale-100");
  }, 50);
});

// Función para cerrar el modal
const cerrarModalDressCode = () => {
  modalDressCodeContent?.classList.add("opacity-0", "scale-95");
  modalDressCodeContent?.classList.remove("opacity-100", "scale-100");
  setTimeout(() => {
    modalDressCode?.classList.add("hidden");
  }, 300);
};

// Event listeners para cerrar el modal
cerrarDressCode?.addEventListener("click", cerrarModalDressCode);
btnEntendidoDressCode?.addEventListener("click", cerrarModalDressCode);
