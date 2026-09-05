/* =====================================================
   PASAPORTE MISTURERO - 15.ª CUADRILLA
   PÁGINA DE INICIO
   ===================================================== */

const STORAGE_KEY = "pasaporteMisturero15";
const TOTAL_VISITAS = 4;

document.addEventListener("DOMContentLoaded", iniciarPagina);

function iniciarPagina() {
    const progreso = obtenerProgreso();
    actualizarBienvenida(progreso);
    configurarBoton(progreso);
}

function obtenerProgreso() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    try {
        const resultado = JSON.parse(data);

        if (!Array.isArray(resultado)) {
            return [];
        }

        return [
            ...new Set(
                resultado.filter(
                    numero =>
                        Number.isInteger(numero) &&
                        numero >= 1 &&
                        numero <= TOTAL_VISITAS
                )
            )
        ].sort((a, b) => a - b);
    } catch {
        return [];
    }
}

function actualizarBienvenida(progreso) {
    const cantidad = progreso.length;

    if (cantidad === 0) {
        return;
    }

    const mensaje = document.getElementById("mensaje-bienvenida");
    const bloqueProgreso = document.getElementById("progreso-previo");
    const numero = document.getElementById("progreso-numero");
    const texto = document.getElementById("progreso-texto");

    mensaje.textContent =
        "¡Bienvenido nuevamente! Continúa tu recorrido por la exposición de la 15.ª Cuadrilla.";

    numero.textContent = `${cantidad} / ${TOTAL_VISITAS}`;

    if (cantidad === TOTAL_VISITAS) {
        texto.textContent = "Tu Pasaporte Misturero está completo.";
    } else {
        const faltantes = TOTAL_VISITAS - cantidad;
        texto.textContent =
            faltantes === 1
                ? "Te falta 1 punto para completar el recorrido."
                : `Te faltan ${faltantes} puntos para completar el recorrido.`;
    }

    bloqueProgreso.classList.remove("oculto");
}

function configurarBoton(progreso) {
    const boton = document.getElementById("btn-iniciar");

    if (progreso.length > 0) {
        boton.textContent =
            progreso.length === TOTAL_VISITAS
                ? "Ver mi Pasaporte completo"
                : "Continuar mi recorrido";
    }

    boton.addEventListener("click", () => {
        window.location.href = "pasaporte.html";
    });
}
