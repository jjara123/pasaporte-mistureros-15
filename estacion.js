/* =====================================================
   CONTENIDO COMPLEMENTARIO - 15.ª CUADRILLA
   ===================================================== */

const STORAGE_KEY = "pasaporteMisturero15";
const TOTAL_ESTACIONES = 4;

const HITOS_FUNDACION = [
    {
        anio: "1953",
        detalle: "19 Octubre\nPrimera Jornada"
    },
    {
        anio: "1954",
        detalle: "Fundación - 10 de Mayo\nMayordomo General:\nDon Julio García Pancorvo"
    },
    {
        anio: "1974",
        detalle: "Guardada\nCapataz:\nHno David Cervetto Palaferri"
    },
    {
        anio: "1979",
        detalle: "Bodas de Plata\nPrimera cuadrilla que obsequia la vara de oro y plata a las andas del señor, con insignia de la cuadrilla.\nCapataz: David Cervetto Palaferri\nPatrón de andas: José Achong Carrión"
    },
    {
        anio: "1982",
        detalle: "Guardada\nCapataz: Hno. Nestor Quintana"
    },
    {
        anio: "1992",
        detalle: "Guardada\nCapataz: Hno. Jose Franco Seminario"
    },
    {
        anio: "2002",
        detalle: "Guardada\nCapataz: Hno. Gerardo Bustamante."
    },
    {
        anio: "2004",
        detalle: "Bodas de Oro\nCapataz: Hno. Gerardo Bustamante."
    },
    {
        anio: "2012",
        detalle: "Guardada\nCapataz: Hno. Sebastian Torres Parodi."
    },
    {
        anio: "2024",
        detalle: "Guardada\nCapataz: Renzo Espinel Cuba"
    },
    {
        anio: "2026",
        detalle: "Actualidad\nCapataz: Jhonny Zambrano Castro"
    }
];

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
            "Desde la primera jornada de 1953 hasta la actualidad, esta línea de tiempo reúne algunos de los principales hitos de la Décima Quinta Cuadrilla.",
            "Recorre los años, guardadas, aniversarios y nombres que forman parte de esta historia."
        ],
        tipoEspecial: "timeline"
    },
    2: {
        kicker: "Punto 2 de 4",
        titulo: "La labor del Misturero",
        subtitulo: "Servicio y tradición",
        imagen: "img/estaciones/labor-mistureros-1.jpg",
        alt: "Hermanos Mistureros durante el recorrido procesional",
        intro:
            "¿Qué significa ser Misturero?",
        parrafos: [
            "En una sola frase, es el oficio más humilde, pero es el mayor de los honores. Esto, resume nuestro origen servicial."
        ],
        tipoEspecial: "mistureros"
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

    // En la estación 2 mostramos la fotografía completa, sin recortarla.
    if (estacionId === 2) {
        imagen.classList.add("imagen-labor-misturero");
    } else {
        imagen.classList.remove("imagen-labor-misturero");
    }

    // En la estación 3 mostramos la imagen completa, centrada y con aire alrededor.
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

        const kicker = document.createElement("p");
        kicker.className = "contenido-especial-kicker";
        kicker.textContent = "Nuestra historia";

        const titulo = document.createElement("h3");
        titulo.textContent = "Línea de tiempo de la 15.ª Cuadrilla";

        bloque.appendChild(kicker);
        bloque.appendChild(titulo);

        HITOS_FUNDACION.forEach(hito => {
            const item = document.createElement("div");
            item.className = "timeline-item";

            const anio = document.createElement("strong");
            anio.textContent = hito.anio;

            const detalle = document.createElement("span");
            const lineas = hito.detalle.split("\n");

            const primeraLinea = document.createElement("strong");
            primeraLinea.textContent = lineas[0];
            detalle.appendChild(primeraLinea);

            if (lineas.length > 1) {
                const resto = document.createElement("span");
                resto.textContent = "\n" + lineas.slice(1).join("\n");
                resto.style.whiteSpace = "pre-line";
                detalle.appendChild(resto);
            }

            detalle.style.whiteSpace = "pre-line";

            item.appendChild(anio);
            item.appendChild(detalle);
            bloque.appendChild(item);
        });

        contenedor.appendChild(bloque);
    }


    if (tipo === "mistureros") {
        const bloque = document.createElement("div");
        bloque.className = "misturero-contenido";

        const funciones = document.createElement("section");
        funciones.className = "misturero-seccion";
        funciones.innerHTML = `
            <p class="contenido-especial-kicker">Servicio durante la procesión</p>
            <h3>Las funciones del Misturero</h3>
            <p>
                Se encargan de colocar los cirios, banderines, flores y conos que donan las cuadrillas y los fieles, a lo largo de la procesión. Están presentes durante todo el recorrido procesional, cuidando los lienzos, las joyas del Señor, previniendo accidentes con los cirios, colocándolos de manera adecuada, además de mantener la limpieza y orden del anda.
            </p>
        `;

        const imagenCirios = document.createElement("figure");
        imagenCirios.className = "misturero-imagen-secundaria";
        imagenCirios.innerHTML = `
            <img
                src="img/estaciones/labor-mistureros-2.jpg"
                alt="Cirios vinculados a la labor de los Mistureros"
            >
        `;

        const organizacion = document.createElement("section");
        organizacion.className = "misturero-seccion";
        organizacion.innerHTML = `
            <p class="contenido-especial-kicker">Compromiso y organización</p>
            <h3>Organización de los Mistureros</h3>
            <p>
                Se organizan en grupos, de diversas cuadrillas. El actual jefe de Mistureros, es de la cuadrilla 20, mientras que el sub jefe, es de la Cuadrilla 15. Se eligen por designio de cada cuadrilla, ya que los capataces designan quienes van a trabajar en esta labor. Debe ser un hermano que muestre total compromiso, además de virtudes como la humildad, el servicio y las ganas de trabajar. Las labores, son muy arduas, ya que empiezan desde muy temprano, a las 3 am.
            </p>
            <p>
                La programación es por turnos, cada cinco cuadrillas. Actualmente, la Hermandad tiene más de 20 hermanos, en este orden:
            </p>
            <ul class="misturero-lista">
                <li>Mistureros Titulares</li>
                <li>Mistureros Suplentes</li>
                <li>Mistureros de avanzada</li>
            </ul>
        `;

        bloque.appendChild(funciones);
        bloque.appendChild(imagenCirios);
        bloque.appendChild(organizacion);
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
