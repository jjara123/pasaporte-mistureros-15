/* =====================================================
   LA RUTA DEL MISTURERO - DÉCIMA QUINTA CUADRILLA
   ===================================================== */

const TOTAL_ESTACIONES = 4;
const STORAGE_KEY = "pasaporteMisturero15";

const ESTACIONES = [
    {
        id: 1,
        titulo: "Fundación",
        subtitulo: "Línea de tiempo"
    },
    {
        id: 2,
        titulo: "La labor del Misturero",
        subtitulo: "Servicio y tradición"
    },
    {
        id: 3,
        titulo: "Las Guardadas",
        subtitulo: "Tradición y preparación"
    },
    {
        id: 4,
        titulo: "Hermanos Notables",
        subtitulo: "Huellas en la 15.ª Cuadrilla"
    }
];

let progreso = obtenerProgreso();
let qrScanner = null;
let scannerProcesando = false;

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {
    registrarEstacionDesdeURL();
    renderizarEstaciones();
    actualizarProgreso();
    configurarBotones();
}

/* =====================================================
   STORAGE
   ===================================================== */

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
                        numero <= TOTAL_ESTACIONES
                )
            )
        ].sort((a, b) => a - b);
    } catch {
        return [];
    }
}

function guardarProgreso() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progreso));
}

/* =====================================================
   REGISTRO DESDE URL DEL PASAPORTE
   Solo se usa si en algún momento abrimos pasaporte.html?estacion=N
   ===================================================== */

function obtenerEstacionURL() {
    const params = new URLSearchParams(window.location.search);
    const numero = Number(params.get("estacion"));

    if (
        !Number.isInteger(numero) ||
        numero < 1 ||
        numero > TOTAL_ESTACIONES
    ) {
        return null;
    }

    return numero;
}

function registrarEstacionDesdeURL() {
    const estacion = obtenerEstacionURL();

    if (!estacion) {
        return;
    }

    const yaExiste = progreso.includes(estacion);

    if (!yaExiste) {
        progreso.push(estacion);
        progreso.sort((a, b) => a - b);
        guardarProgreso();
    }

    mostrarMensaje(estacion, yaExiste);
}

function obtenerEstacion(numero) {
    return ESTACIONES.find(estacion => estacion.id === numero) || null;
}

function mostrarMensaje(numero, yaExiste) {
    const estacion = obtenerEstacion(numero);

    if (!estacion) {
        return;
    }

    const contenedor = document.getElementById("mensaje-estacion");
    const numeroElemento = document.getElementById("mensaje-numero");
    const etiqueta = document.getElementById("mensaje-etiqueta");
    const titulo = document.getElementById("mensaje-titulo");
    const texto = document.getElementById("mensaje-texto");

    numeroElemento.textContent = numero;
    titulo.textContent = estacion.titulo;

    if (yaExiste) {
        etiqueta.textContent = "Punto ya registrado";
        texto.textContent = `Este punto ya forma parte de tu recorrido. Llevas ${progreso.length} de ${TOTAL_ESTACIONES}.`;
    } else {
        etiqueta.textContent = "Punto registrado";
        texto.textContent = `¡Muy bien! Llevas ${progreso.length} de ${TOTAL_ESTACIONES} puntos completados.`;
    }

    contenedor.classList.remove("oculto");
}

/* =====================================================
   ESTACIONES
   ===================================================== */

function renderizarEstaciones() {
    const contenedor = document.getElementById("estaciones");
    contenedor.innerHTML = "";

    ESTACIONES.forEach(estacion => {
        const item = document.createElement("article");
        item.className = "cuadrilla estacion-card";

        const icono = document.createElement("div");
        icono.className = "estacion-icon";
        icono.textContent = estacion.id;

        const nombre = document.createElement("span");
        nombre.className = "nombre-cuadrilla estacion-titulo";
        nombre.textContent = estacion.titulo;

        const subtitulo = document.createElement("small");
        subtitulo.className = "estacion-subtitulo";
        subtitulo.textContent = estacion.subtitulo;

        const check = document.createElement("span");
        check.className = "check-cuadrilla";
        check.textContent = "✓";

        item.appendChild(icono);
        item.appendChild(nombre);
        item.appendChild(subtitulo);
        item.appendChild(check);

        if (progreso.includes(estacion.id)) {
            item.classList.add("completada");

            const enlace = document.createElement("a");
            enlace.className = "btn-ver-contenido";
            enlace.href = `estacion.html?estacion=${estacion.id}&revisita=1`;
            enlace.textContent = "Ver contenido";
            item.appendChild(enlace);
        } else {
            const estado = document.createElement("span");
            estado.className = "estacion-bloqueada";
            estado.textContent = "Escanea su QR para registrarlo";
            item.appendChild(estado);
        }

        contenedor.appendChild(item);
    });
}

/* =====================================================
   PROGRESO
   ===================================================== */

function actualizarProgreso() {
    const cantidad = progreso.length;
    const porcentaje = Math.round((cantidad / TOTAL_ESTACIONES) * 100);

    document.getElementById("progreso-texto").textContent =
        `${cantidad} / ${TOTAL_ESTACIONES}`;

    document.getElementById("porcentaje").textContent =
        `${porcentaje}%`;

    document.getElementById("progress-fill").style.width =
        `${porcentaje}%`;

    document.getElementById("mensaje-progreso").textContent =
        cantidad === TOTAL_ESTACIONES
            ? "¡Completaste los cuatro puntos de la exposición!"
            : cantidad === 0
                ? "Tu recorrido está por comenzar."
                : `Has registrado ${cantidad} de ${TOTAL_ESTACIONES} puntos.`;

    if (cantidad === TOTAL_ESTACIONES) {
        mostrarFelicitaciones();
    }
}

/* =====================================================
   FELICITACIONES / TARJETA FINAL
   ===================================================== */

function mostrarFelicitaciones() {
    document.getElementById("felicitaciones").classList.remove("oculto");
    document.getElementById("mensaje-principal").textContent =
        "¡Has completado La ruta del Misturero!";
    generarTarjetaLogro();
}

function cargarImagen(ruta) {
    return new Promise((resolve, reject) => {
        const imagen = new Image();
        imagen.onload = () => resolve(imagen);
        imagen.onerror = reject;
        imagen.src = ruta;
    });
}

async function generarTarjetaLogro() {
    const canvas = document.getElementById("canvas-logro");
    const ctx = canvas.getContext("2d");
    const ancho = canvas.width;
    const alto = canvas.height;

    const gradiente = ctx.createLinearGradient(0, 0, 0, alto);
    gradiente.addColorStop(0, "#210428");
    gradiente.addColorStop(1, "#1b021f");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, ancho, alto);

    try {
        const senor = await cargarImagen("img/senor-milagros.png");
        ctx.save();
        ctx.globalAlpha = 0.10;
        ctx.drawImage(senor, -140, 80, 700, 1200);
        ctx.restore();
    } catch {}

    ctx.strokeStyle = "#d7b66a";
    ctx.lineWidth = 6;
    ctx.strokeRect(45, 45, ancho - 90, alto - 90);

    try {
        const insignia = await cargarImagen("img/insignia_15.png");

        const maxAncho = 184;
        const maxAlto = 184;
        const escala = Math.min(maxAncho / insignia.width, maxAlto / insignia.height);
        const imgAncho = insignia.width * escala;
        const imgAlto = insignia.height * escala;

        ctx.drawImage(
            insignia,
            ancho / 2 - imgAncho / 2,
            80 + (maxAlto - imgAlto) / 2,
            imgAncho,
            imgAlto
        );
    } catch {}

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 27px Georgia";
    ctx.font = "bold 23px Georgia";
    ctx.fillText("HSMN - DÉCIMA QUINTA CUADRILLA", ancho / 2, 300);
    ctx.fillText("LOS MISTUREROS DEL SEÑOR", ancho / 2, 337);

    ctx.font = "bold 82px Georgia";
    ctx.fillText("LA RUTA", ancho / 2, 455);

    ctx.fillStyle = "#e3bd58";
    ctx.font = "bold 72px Georgia";
    ctx.fillText("DEL MISTURERO", ancho / 2, 545);

    ctx.beginPath();
    ctx.arc(ancho / 2, 690, 58, 0, Math.PI * 2);
    ctx.strokeStyle = "#d7b66a";
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = "#d7b66a";
    ctx.font = "bold 76px Arial";
    ctx.fillText("✓", ancho / 2, 718);

    ctx.font = "bold 115px Georgia";
    ctx.fillText("4 / 4", ancho / 2, 875);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px Georgia";
    ctx.fillText("¡RECORRIDO COMPLETADO!", ancho / 2, 955);

    ctx.font = "29px Georgia";
    ctx.fillText("Has completado los cuatro puntos", ancho / 2, 1050);
    ctx.fillText("de la exposición de la 15.ª Cuadrilla.", ancho / 2, 1090);

    ctx.fillStyle = "#d7b66a";
    ctx.font = "bold 25px Georgia";
    ctx.fillText("FE · TRADICIÓN · SERVICIO", ancho / 2, 1150);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Georgia";
    ctx.fillText("#RutaDelMisturero", ancho / 2, 1230);

    ctx.fillStyle = "#d7b66a";
    ctx.font = "bold 25px Georgia";
    ctx.fillText("2026", ancho / 2, 1275);

    document.getElementById("imagen-logro").src =
        canvas.toDataURL("image/png");
}

/* =====================================================
   ESCÁNER QR
   ===================================================== */

async function abrirScanner() {
    const modal = document.getElementById("modal-scanner");
    const mensaje = document.getElementById("scanner-mensaje");

    modal.classList.remove("oculto");
    mensaje.classList.add("oculto");
    mensaje.classList.remove("error");
    scannerProcesando = false;

    if (typeof Html5Qrcode === "undefined") {
        mostrarMensajeScanner("No se pudo cargar el lector QR.", true);
        return;
    }

    qrScanner = new Html5Qrcode("qr-reader");

    try {
        await qrScanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            codigoDetectado,
            () => {}
        );
    } catch {
        mostrarMensajeScanner(
            "No se pudo acceder a la cámara. Verifica los permisos del navegador.",
            true
        );
    }
}

async function codigoDetectado(textoQR) {
    if (scannerProcesando) {
        return;
    }

    scannerProcesando = true;

    const estacion = obtenerEstacionDesdeQR(textoQR);

    if (!estacion) {
        mostrarMensajeScanner(
            "Este QR no pertenece a La ruta del Misturero.",
            true
        );
        scannerProcesando = false;
        return;
    }

    await detenerScanner();
    window.location.href = `estacion.html?estacion=${estacion}`;
}

function obtenerEstacionDesdeQR(textoQR) {
    try {
        const url = new URL(textoQR, window.location.href);

        if (url.hostname !== window.location.hostname) {
            return null;
        }

        if (!url.pathname.endsWith("/estacion.html")) {
            return null;
        }

        const numero = Number(url.searchParams.get("estacion"));

        if (
            !Number.isInteger(numero) ||
            numero < 1 ||
            numero > TOTAL_ESTACIONES
        ) {
            return null;
        }

        return numero;
    } catch {
        return null;
    }
}

function mostrarMensajeScanner(texto, error = false) {
    const mensaje = document.getElementById("scanner-mensaje");
    mensaje.textContent = texto;
    mensaje.classList.remove("oculto");
    mensaje.classList.toggle("error", error);
}

async function detenerScanner() {
    if (!qrScanner) {
        return;
    }

    try {
        await qrScanner.stop();
        qrScanner.clear();
    } catch {}

    qrScanner = null;
}

async function cerrarScanner() {
    await detenerScanner();
    document.getElementById("modal-scanner").classList.add("oculto");
}

/* =====================================================
   COMPARTIR / GUARDAR
   ===================================================== */

async function compartirRecorrido() {
    const canvas = document.getElementById("canvas-logro");

    canvas.toBlob(async blob => {
        if (!blob) {
            return;
        }

        const archivo = new File(
            [blob],
            "ruta-del-misturero.png",
            { type: "image/png" }
        );

        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({ files: [archivo] })
        ) {
            await navigator.share({
                files: [archivo],
                text: "¡Completé La ruta del Misturero de la Décima Quinta Cuadrilla!"
            });
            return;
        }

        guardarRecuerdo();
    });
}

async function guardarRecuerdo() {
    const canvas = document.getElementById("canvas-logro");
    const enlace = document.createElement("a");
    enlace.download = "ruta-del-misturero.png";
    enlace.href = canvas.toDataURL("image/png");
    enlace.click();
}

/* =====================================================
   AYUDA / EVENTOS
   ===================================================== */

function abrirAyuda() {
    document.getElementById("modal-ayuda").classList.remove("oculto");
}

function cerrarAyuda() {
    document.getElementById("modal-ayuda").classList.add("oculto");
}

function configurarBotones() {
    document.getElementById("btn-ayuda")?.addEventListener("click", abrirAyuda);
    document.getElementById("btn-cerrar-ayuda")?.addEventListener("click", cerrarAyuda);
    document.getElementById("btn-entendido")?.addEventListener("click", cerrarAyuda);
    document.getElementById("btn-escanear")?.addEventListener("click", abrirScanner);
    document.getElementById("btn-cerrar-scanner")?.addEventListener("click", cerrarScanner);
    document.getElementById("btn-compartir")?.addEventListener("click", compartirRecorrido);
    document.getElementById("btn-descargar")?.addEventListener("click", guardarRecuerdo);
}
