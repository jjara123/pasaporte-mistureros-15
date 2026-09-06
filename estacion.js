/* =====================================================
   CONTENIDO COMPLEMENTARIO - 15.ª CUADRILLA
   ===================================================== */

const STORAGE_KEY = "pasaporteMisturero15";
const TOTAL_ESTACIONES = 4;

const CONTENIDOS = {
    1: {
        kicker: "Punto 1 de 4",
        titulo: "Fundación",
        subtitulo: "Línea de tiempo",
        imagen: "img/estaciones/linea-tiempo.jpg",
        alt: "Imagen complementaria de la línea de tiempo de la 15.ª Cuadrilla",
        intro:
            "Este espacio complementa la línea de tiempo presentada durante la exposición y permite recordar los momentos que han ido construyendo la identidad de la 15.ª Cuadrilla.",
        parrafos: [
            "Aquí puedes colocar una breve reseña histórica que acompañe las fechas, fotografías y acontecimientos mostrados físicamente en la exposición.",
            "Cuando tengas las fechas definitivas, este bloque puede convertirse en una línea de tiempo digital con hitos, años y fotografías históricas."
        ],
        tipoEspecial: "timeline"
    },
    2: {
        kicker: "Punto 2 de 4",
        titulo: "La labor del Misturero",
        subtitulo: "Servicio y tradición",
        imagen: "img/estaciones/labor-mistureros.jpg",
        alt: "Imagen complementaria sobre la labor de los Mistureros",
        intro:
            "La labor de los Mistureros forma parte de la identidad de la 15.ª Cuadrilla y se transmite de generación en generación como una expresión de servicio y tradición.",
        parrafos: [
            "Este contenido puede ampliar lo explicado presencialmente: preparación, participación durante la procesión, elementos utilizados y el significado que tiene esta labor para los hermanos de la cuadrilla.",
            "También puedes incorporar fotografías del servicio de los Mistureros para que el visitante reconozca cómo se vive esta labor en el recorrido procesional."
        ]
    },
    3: {
        kicker: "Punto 3 de 4",
        titulo: "Las Guardadas",
        subtitulo: "Tradición y preparación",
        imagen: "img/senor-milagros.png",
        alt: "Imagen del Señor de los Milagros",
        intro:
            "La imagen del Señor de los Milagros ocupa el centro de esta experiencia y recuerda el motivo de fe que reúne a los hermanos y devotos.",
        parrafos: [
            "En este punto puedes colocar la breve descripción que acompañará la imagen durante la exposición, resaltando su significado dentro de la devoción y su vínculo con la vida de la cuadrilla.",
            "La intención de este contenido es complementar la explicación presencial sin reemplazarla, permitiendo que el visitante conserve un recuerdo digital del punto visitado."
        ]
    },
    4: {
        kicker: "Punto 4 de 4",
        titulo: "Hermanos Notables",
        subtitulo: "Huellas en la 15.ª Cuadrilla",
        imagen: "img/estaciones/hermanos-destacados.jpg",
        alt: "Fotografía complementaria de hermanos destacados de la 15.ª Cuadrilla",
        intro:
            "La historia de una cuadrilla también se construye con las personas que sirvieron, acompañaron y dejaron una huella especial en sus hermanos.",
        parrafos: [
            "En este espacio podrás presentar fotografías y pequeñas reseñas de los hermanos que la cuadrilla haya elegido destacar durante la exposición.",
            "Los nombres y reseñas que aparecen debajo son espacios preparados para que coloques la información definitiva."
        ],
        tipoEspecial: "hermanos"
    }
};

document.addEventListener("DOMContentLoaded", iniciarEstacion);

function iniciarEstacion() {
    const estacionId = obtenerEstacionDesdeURL();

    if (!estacionId || !CONTENIDOS[estacionId]) {
        mostrarError();
        return;
    }

    const yaRegistrada = registrarEstacion(estacionId);
    renderizarContenido(estacionId, yaRegistrada);
    actualizarProgreso();
}

function obtenerEstacionDesdeURL() {
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

function registrarEstacion(estacionId) {
    const progreso = obtenerProgreso();
    const yaRegistrada = progreso.includes(estacionId);

    if (!yaRegistrada) {
        progreso.push(estacionId);
        progreso.sort((a, b) => a - b);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progreso));
    }

    return yaRegistrada;
}

function renderizarContenido(estacionId, yaRegistrada) {
    const contenido = CONTENIDOS[estacionId];

    document.title = `${contenido.titulo} | La ruta del Misturero`;
    document.getElementById("estacion-kicker").textContent = contenido.kicker;
    document.getElementById("estacion-titulo").textContent = contenido.titulo;
    document.getElementById("estacion-subtitulo").textContent = contenido.subtitulo;
    document.getElementById("estacion-intro").textContent = contenido.intro;

    const imagen = document.getElementById("estacion-imagen");
    const fallback = document.getElementById("imagen-fallback");

    imagen.src = contenido.imagen;
    imagen.alt = contenido.alt;

    // En la estación 3 mostramos la imagen completa, sin recortarla.
    if (estacionId === 3) {
        imagen.classList.add("imagen-completa");
        document.querySelector(".imagen-estacion-wrap")?.classList.add("imagen-completa-wrap");
    } else {
        imagen.classList.remove("imagen-completa");
        document.querySelector(".imagen-estacion-wrap")?.classList.remove("imagen-completa-wrap");
    }

    imagen.addEventListener("error", () => {
        imagen.classList.add("oculto");
        fallback.classList.remove("oculto");
    });

    const parrafos = document.getElementById("estacion-parrafos");
    parrafos.innerHTML = "";

    contenido.parrafos.forEach(texto => {
        const p = document.createElement("p");
        p.textContent = texto;
        parrafos.appendChild(p);
    });

    const registroTitulo = document.getElementById("registro-titulo");
    const registroTexto = document.getElementById("registro-texto");

    if (yaRegistrada) {
        registroTitulo.textContent = "Punto ya registrado";
        registroTexto.textContent =
            "Ya habías visitado este punto. Puedes volver a consultar su contenido cuando quieras.";
    } else {
        registroTitulo.textContent = "¡Punto registrado!";
        registroTexto.textContent =
            "Este punto acaba de marcarse con un check en tu Ruta del Misturero.";
    }

    renderizarContenidoEspecial(contenido.tipoEspecial);
}

function renderizarContenidoEspecial(tipo) {
    const contenedor = document.getElementById("contenido-especial");
    contenedor.innerHTML = "";

    if (tipo === "timeline") {
        const bloque = document.createElement("div");
        bloque.className = "timeline-placeholder";
        bloque.innerHTML = `
            <p class="contenido-especial-kicker">Para completar después</p>
            <h3>Hitos de la 15.ª Cuadrilla</h3>
            <div class="timeline-item"><strong>Año</strong><span>Primer hito histórico de la cuadrilla.</span></div>
            <div class="timeline-item"><strong>Año</strong><span>Segundo hito histórico de la cuadrilla.</span></div>
            <div class="timeline-item"><strong>Año</strong><span>Tercer hito histórico de la cuadrilla.</span></div>
        `;
        contenedor.appendChild(bloque);
    }

    if (tipo === "hermanos") {
        const bloque = document.createElement("div");
        bloque.className = "hermanos-grid";

        for (let i = 1; i <= 3; i++) {
            const card = document.createElement("article");
            card.className = "hermano-card";
            card.innerHTML = `
                <div class="hermano-avatar">${i}</div>
                <div>
                    <h3>Hermano destacado ${i}</h3>
                    <p>Reemplaza este texto con su nombre, periodo, cargo o aporte y una breve reseña.</p>
                </div>
            `;
            bloque.appendChild(card);
        }

        contenedor.appendChild(bloque);
    }
}

function actualizarProgreso() {
    const progreso = obtenerProgreso();
    const cantidad = progreso.length;
    const porcentaje = Math.round((cantidad / TOTAL_ESTACIONES) * 100);

    document.getElementById("estacion-progreso-numero").textContent =
        `${cantidad} / ${TOTAL_ESTACIONES}`;

    document.getElementById("estacion-progreso-porcentaje").textContent =
        `${porcentaje}%`;

    document.getElementById("estacion-progress-fill").style.width =
        `${porcentaje}%`;
}

function mostrarError() {
    document.getElementById("estacion-kicker").textContent = "La ruta del Misturero";
    document.getElementById("estacion-titulo").textContent = "Punto no encontrado";
    document.getElementById("estacion-subtitulo").textContent =
        "El enlace escaneado no corresponde a uno de los cuatro puntos de la exposición.";

    document.getElementById("registro-confirmado").classList.add("oculto");
    document.querySelector(".contenido-estacion").classList.add("oculto");
    document.querySelector(".estacion-progreso").classList.add("oculto");
}
