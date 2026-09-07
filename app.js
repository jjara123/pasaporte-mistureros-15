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

    const ancho = canvas.width;   // 1080
    const alto = canvas.height;   // 1350

    /* =====================================================
       FONDO
       ===================================================== */

    const gradiente = ctx.createLinearGradient(
        0,
        0,
        ancho,
        alto
    );

    gradiente.addColorStop(
        0,
        "#3d0860"
    );

    gradiente.addColorStop(
        0.55,
        "#2b0447"
    );

    gradiente.addColorStop(
        1,
        "#200333"
    );

    ctx.fillStyle = gradiente;

    ctx.fillRect(
        0,
        0,
        ancho,
        alto
    );


    /* =====================================================
       IMAGEN DEL SEÑOR - LADO IZQUIERDO
       ===================================================== */

    try {

        const senor =
            await cargarImagen(
                "img/senor-milagros.png"
            );


        ctx.save();

        ctx.globalAlpha =
            0.42;


        /*
         * Se dibuja grande y hacia el lado izquierdo
         * para conseguir el efecto del modelo:
         * imagen procesional integrada con el fondo.
         */

        const altoImagen =
            1020;

        const escala =
            altoImagen /
            senor.height;

        const anchoImagen =
            senor.width *
            escala;


        ctx.drawImage(
            senor,
            -110,
            300,
            anchoImagen,
            altoImagen
        );


        /*
         * Degradado oscuro sobre la fotografía para
         * integrarla con el morado de la tarjeta.
         */

        const mascara =
            ctx.createLinearGradient(
                80,
                0,
                650,
                0
            );


        mascara.addColorStop(
            0,
            "rgba(40, 4, 62, 0.05)"
        );

        mascara.addColorStop(
            0.62,
            "rgba(40, 4, 62, 0.42)"
        );

        mascara.addColorStop(
            1,
            "rgba(40, 4, 62, 1)"
        );


        ctx.fillStyle =
            mascara;


        ctx.fillRect(
            0,
            240,
            720,
            1110
        );


        ctx.restore();

    } catch {}


    /* =====================================================
       LAUREL DECORATIVO SUAVE - LADO DERECHO
       ===================================================== */

    ctx.save();

    ctx.globalAlpha =
        0.11;

    ctx.strokeStyle =
        "#ffffff";

    ctx.fillStyle =
        "#ffffff";

    ctx.lineWidth =
        5;


    ctx.beginPath();

    ctx.moveTo(
        935,
        100
    );

    ctx.bezierCurveTo(
        1070,
        330,
        1010,
        760,
        845,
        1160
    );

    ctx.stroke();


    for (
        let i = 0;
        i < 13;
        i++
    ) {

        const t =
            i /
            12;


        const y =
            150 +
            t *
            950;


        const curva =
            Math.sin(
                t *
                Math.PI
            );


        const x =
            942 +
            58 *
            curva;


        ctx.save();

        ctx.translate(
            x,
            y
        );


        ctx.rotate(
            -0.48 +
            t *
            0.22
        );


        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            24,
            58,
            0,
            0,
            Math.PI *
            2
        );

        ctx.fill();


        ctx.restore();
    }


    ctx.restore();


    /* =====================================================
       MARCO DORADO
       ===================================================== */

    ctx.strokeStyle =
        "#e7c451";

    ctx.lineWidth =
        5;


    ctx.strokeRect(
        38,
        38,
        ancho -
        76,
        alto -
        76
    );


    /* =====================================================
       TÍTULO
       ===================================================== */

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "alphabetic";


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "54px Arial";


    ctx.fillText(
        "LA RUTA DEL",
        ancho /
        2,
        205
    );


    ctx.fillStyle =
        "#efcf5d";


    ctx.font =
        "88px Arial";


    ctx.fillText(
        "MISTURERO",
        ancho /
        2,
        315
    );


    /* =====================================================
       INSIGNIA CENTRAL
       ===================================================== */

    try {

        const insignia =
            await cargarImagen(
                "img/insignia_15.png"
            );


        const maxAncho =
            500;

        const maxAlto =
            500;


        const escala =
            Math.min(
                maxAncho /
                insignia.width,
                maxAlto /
                insignia.height
            );


        const imgAncho =
            insignia.width *
            escala;

        const imgAlto =
            insignia.height *
            escala;


        ctx.drawImage(
            insignia,
            ancho /
            2 -
            imgAncho /
            2,
            370,
            imgAncho,
            imgAlto
        );

    } catch {}


    /* =====================================================
       MENSAJE DE VISITA
       ===================================================== */

    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "28px Arial";


    ctx.fillText(
        "HE VISITADO LA OFICINA DE LA DÉCIMA QUINTA CUADRILLA",
        ancho /
        2,
        925
    );


    ctx.fillText(
        "DE LA HERMANDAD DEL SEÑOR DE LOS MILAGROS DE NAZARENAS",
        ancho /
        2,
        962
    );


    /* =====================================================
       EXPOSICIÓN
       ===================================================== */

    ctx.font =
        "53px Arial";


    ctx.fillText(
        "EXPOSICIÓN NAZARENA 2026",
        ancho /
        2,
        1075
    );


    /* =====================================================
       DATOS INFERIORES / REDES
       ===================================================== */

    const yRedes =
        1195;


    /* Facebook */

    ctx.beginPath();

    ctx.arc(
        455,
        yRedes,
        31,
        0,
        Math.PI *
        2
    );


    ctx.fillStyle =
        "#ffffff";

    ctx.fill();


    ctx.fillStyle =
        "#3b0759";

    ctx.font =
        "bold 42px Arial";

    ctx.fillText(
        "f",
        455,
        yRedes +
        15
    );


    ctx.textAlign =
        "left";

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "20px Arial";


    ctx.fillText(
        "Décima Quinta Cuadrilla",
        500,
        yRedes -
        12
    );


    ctx.fillText(
        "Hermandad del Señor de los",
        500,
        yRedes +
        13
    );


    ctx.fillText(
        "Milagros de Nazarenas",
        500,
        yRedes +
        38
    );


    /* Instagram */

    ctx.beginPath();

    ctx.arc(
        815,
        yRedes,
        31,
        0,
        Math.PI *
        2
    );


    ctx.fillStyle =
        "#ffffff";

    ctx.fill();


    ctx.strokeStyle =
        "#3b0759";

    ctx.lineWidth =
        4;


    ctx.strokeRect(
        799,
        yRedes -
        16,
        32,
        32
    );


    ctx.beginPath();

    ctx.arc(
        815,
        yRedes,
        8,
        0,
        Math.PI *
        2
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.arc(
        824,
        yRedes -
        9,
        2.5,
        0,
        Math.PI *
        2
    );

    ctx.fillStyle =
        "#3b0759";

    ctx.fill();


    ctx.fillStyle =
        "#ffffff";

    ctx.textAlign =
        "left";

    ctx.font =
        "20px Arial";


    ctx.fillText(
        "Décima Quinta",
        860,
        yRedes -
        5
    );


    ctx.fillText(
        "Cuadrilla HSMN",
        860,
        yRedes +
        23
    );


    /* =====================================================
       ACTUALIZAR PREVISUALIZACIÓN
       ===================================================== */

    document.getElementById(
        "imagen-logro"
    ).src =
        canvas.toDataURL(
            "image/png"
        );
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
                text: "¡Completé La Ruta del Misturero! 💜\n" +
                    "Fe · Tradición · Servicio\n" +
                    "@quincenazarenas"
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
