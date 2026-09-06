LA RUTA DEL MISTURERO - DÉCIMA QUINTA CUADRILLA
====================================

ARCHIVOS PRINCIPALES
- index.html        : portada
- inicio.css        : diseño de portada (se mantiene el estilo anterior)
- inicio.js         : progreso 4/4
- pasaporte.html    : ruta con los 4 puntos
- styles.css        : diseño de la ruta + página de contenido
- app.js            : progreso, checks, scanner QR y tarjeta final
- estacion.html     : página que abre cada QR
- estacion.js       : registra el punto y muestra el contenido complementario

PROGRESO
Se guarda con la clave localStorage: pasaporteMisturero15
Esto evita mezclar el avance con el antiguo Pasaporte Nazareno de 23 visitas.

LOS 4 QR DEBEN APUNTAR A:
1) estacion.html?estacion=1
2) estacion.html?estacion=2
3) estacion.html?estacion=3
4) estacion.html?estacion=4

En GitHub Pages deben usar la URL completa del sitio. Ejemplo:
https://TU_USUARIO.github.io/TU_REPOSITORIO/estacion.html?estacion=1

IMÁGENES COMPLEMENTARIAS
Crea la carpeta:
img/estaciones/

Y coloca estas imágenes:
- linea-tiempo.jpg
- labor-mistureros.jpg
- hermanos-destacados.jpg

El punto 3 reutiliza temporalmente:
img/senor-milagros.png

Si una de las imágenes complementarias no existe todavía, la página mostrará
la insignia de la 15.ª Cuadrilla como reemplazo visual.

IMPORTANTE
Los textos de la línea de tiempo y de los hermanos destacados están preparados
como plantilla. Reemplázalos en estacion.js cuando tengas las fechas, nombres,
fotos y reseñas definitivas.

ACTUALIZACIÓN INSIGNIA 15
-------------------------
El proyecto ahora usa img/insignia_15.png como insignia principal de la 15.ª Cuadrilla.
La imagen se presenta en formato circular, sobre fondo blanco y con borde dorado.
Conserva ese archivo dentro de la carpeta img al publicar el proyecto.
