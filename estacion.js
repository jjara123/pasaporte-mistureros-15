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
        imagen: "img/estaciones/guardadas-1.jpg",
        alt: "Imagen de una Guardada de la 15.ª Cuadrilla",
        intro:
            "Nuestra cuadrilla está formada por cinco (5) sectores de carguío.",
        parrafos: [
            "Para cada Guardada se han diseñado diversos aditamentos distintivos que adornan el anda, siendo los más representativos los banderines."
        ],
        tipoEspecial: "guardadas"
    },
    4: {
        kicker: "Punto 4 de 4",
        titulo: "Hermanos Notables",
        subtitulo: "Huellas en la 15.ª Cuadrilla",
        imagen: "img/estaciones/hermano-notable-adolfo.jpg",
        alt: "Adolfo Castellano Carrillo, hermano notable de la 15.ª Cuadrilla",
        intro:
            "Es sabido que nuestra cuadrilla, ha tenido grandes hitos históricos.",
        parrafos: [
            "La labor de Mistureros, llevada a cabo por diversos hermanos, ha sido fundamental en la organización de la procesión del Señor de los Milagros."
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

    // En la estación 3 mostramos una fotografía principal de la Guardada sin recortarla.
    if (estacionId === 3) {
        imagen.classList.add("imagen-guardadas-principal");
    } else {
        imagen.classList.remove("imagen-guardadas-principal");
    }

    // En la estación 4 mostramos la imagen completa, centrada y sin recortarla.
    if (estacionId === 4) {
        imagen.classList.add("imagen-hermanos-principal");
    } else {
        imagen.classList.remove("imagen-hermanos-principal");
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

    if (tipo === "guardadas") {
        const bloque = document.createElement("div");
        bloque.className = "guardadas-contenido";

        const texto = document.createElement("section");
        texto.className = "guardadas-seccion";
        texto.innerHTML = `
            <p class="contenido-especial-kicker">Una tradición de nuestra cuadrilla</p>
            <h3>Los cinco sectores y sus distintivos</h3>
            <p>
                En particular, nuestra cuadrilla está formada por <strong>cinco (5) sectores de carguío</strong>, tal como pueden apreciar en la fotografía de la Guardada del 2012.
            </p>
            <p>
                Para cada Guardada se han diseñado diversos aditamentos distintivos que adornan el anda, siendo los más representativos los <strong>banderines</strong>.
            </p>
        `;

        const galeria = document.createElement("div");
        galeria.className = "guardadas-galeria";

        const imagenes = [
            {
                src: "img/estaciones/guardadas-2.jpg",
                alt: "Anda durante una Guardada de la 15.ª Cuadrilla"
            },
            {
                src: "img/estaciones/guardadas-3.jpg",
                alt: "Detalle conmemorativo de una Guardada de la 15.ª Cuadrilla"
            },
            {
                src: "img/estaciones/guardadas-4.jpg",
                alt: "Banderín de los Mistureros durante una Guardada"
            },
            {
                src: "img/estaciones/guardadas-5.jpg",
                alt: "Detalle del anda adornada durante una Guardada de la 15.ª Cuadrilla"
            },
            {
                src: "img/estaciones/guardadas-6.jpg",
                alt: "Hermanos de la 15.ª Cuadrilla reunidos durante la Guardada",
                panoramica: true
            }
        ];

        imagenes.forEach(item => {
            const figure = document.createElement("figure");
            figure.className = "guardadas-foto";

            if (item.panoramica) {
                figure.classList.add("guardadas-foto--panoramica");
            }

            const img = document.createElement("img");
            img.src = item.src;
            img.alt = item.alt;
            img.loading = "lazy";

            figure.appendChild(img);
            galeria.appendChild(figure);
        });

        bloque.appendChild(texto);
        bloque.appendChild(galeria);
        contenedor.appendChild(bloque);
    }


    if (tipo === "hermanos") {
        const bloque = document.createElement("div");
        bloque.className = "hermanos-notables-contenido";

        const encabezado = document.createElement("section");
        encabezado.className = "hermanos-notables-intro";
        encabezado.innerHTML = `
            <p class="contenido-especial-kicker">Legado y servicio</p>
            <h3>Hermanos que dejaron huella</h3>
            <p>
                En nuestras filas, los hermanos Jose Achong Carrion, o más conocido como “el chino Pepe”, fue Patrón de Andas, mientras que nuestro hermano Juan Maldonado Ganoza, fue Jefe de Mistureros, inclusive reconocido con la Orden Nazarena, en el grado de Comendador, el 1 de noviembre del 2002, siendo la última vez que subió al anda, para realizar su labor.
            </p>
        `;

        const tarjetas = document.createElement("div");
        tarjetas.className = "hermanos-notables-grid";

        const achong = document.createElement("article");
        achong.className = "hermano-notable-card";
        achong.innerHTML = `
            <div class="hermano-notable-cabecera">
                <span class="hermano-notable-numero">01</span>
                <div>
                    <p class="hermano-notable-cargo">Patrón de Andas</p>
                    <h3>Jose Achong Carrión</h3>
                    <span class="hermano-notable-apodo">“El chino Pepe”</span>
                </div>
            </div>
            <p>
                El nombre de Jose Achong Carrión, no solo es conocido en el ámbito de la cuadrilla y la hermandad, sino también ha trascendido estos espacios. Además de ser Patrón de Andas, fue utilero del Club Alianza Lima, al igual que de la Selección Nacional. Y es precisamente a él, a quien se le debe, el uso (ahora hecho tradición) de la camiseta blaquimorada, que viste el Club Alianza Lima, durante todos los octubres.
            </p>
        `;

        const maldonado = document.createElement("article");
        maldonado.className = "hermano-notable-card";
        maldonado.innerHTML = `
            <div class="hermano-notable-cabecera">
                <span class="hermano-notable-numero">02</span>
                <div>
                    <p class="hermano-notable-cargo">Jefe de Mistureros</p>
                    <h3>Juan Maldonado Ganoza</h3>
                    <span class="hermano-notable-apodo">Orden Nazarena · Comendador</span>
                </div>
            </div>
            <p>
                Fue Jefe de Mistureros, inclusive reconocido con la Orden Nazarena, en el grado de Comendador, el 1 de noviembre del 2002, siendo la última vez que subió al anda, para realizar su labor.
            </p>
        `;

        tarjetas.appendChild(achong);
        tarjetas.appendChild(maldonado);
        bloque.appendChild(encabezado);
        bloque.appendChild(tarjetas);
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
