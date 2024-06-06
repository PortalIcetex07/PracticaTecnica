// Variables globales
let palabrasTotales = 0;
let coordenadasPalabras = {};
let tiempo = 0;
let intervalo;
let letrasCorrectas = 0;

// Función para actualizar el reloj
function actualizarReloj() {
    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;
    const reloj = document.getElementById("cronometro");
    reloj.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

// Función para iniciar el reloj
function iniciarReloj() {
    tiempo = 0;
    intervalo = setInterval(() => {
        tiempo++;
        actualizarReloj();
    }, 1000);
}

// Función para detener el reloj
function detenerReloj() {
    clearInterval(intervalo);
}

// Función para generar la sopa de letras
function generarSopaDeLetras(dimensiones) {
    const sopa = [];

    for (let i = 0; i < dimensiones; i++) {
        sopa[i] = Array.from({ length: dimensiones }, () => "");
    }

    return sopa;
}

// Función para colocar una palabra en la sopa de letras
function colocarPalabra(sopa, palabra, ocupadas) {
    const direcciones = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    const direccion = direcciones[Math.floor(Math.random() * direcciones.length)];

    let filaInicial = Math.floor(Math.random() * (sopa.length - palabra.length + 1));
    let columnaInicial = Math.floor(Math.random() * (sopa.length - palabra.length + 1));

    if (filaInicial < 0 || filaInicial >= sopa.length || columnaInicial < 0 || columnaInicial >= sopa.length) {
        return false;
    }

    let colision = false;
    const coordenadas = [];
    for (let i = 0; i < palabra.length; i++) {
        const fila = filaInicial + i * direccion[0];
        const columna = columnaInicial + i * direccion[1];
        if (fila < 0 || fila >= sopa.length || columna < 0 || columna >= sopa.length) {
            colision = true;
            break;
        }
        const coord = `${fila},${columna}`;

        if (sopa[fila][columna] !== "" || ocupadas.has(coord)) {
            colision = true;
            break;
        }
        coordenadas.push({ fila, columna });
    }

    if (!colision) {
        coordenadas.forEach((coord, i) => {
            sopa[coord.fila][coord.columna] = palabra.charAt(i);
            ocupadas.add(`${coord.fila},${coord.columna}`);
        });
        return true;
    }

    return false;
}

// Función para colocar todas las palabras en la sopa de letras
function colocarPalabras(sopa, palabras) {
    const ocupadas = new Set();

    palabras.forEach(palabra => {
        let colocada = false;
        let intentos = 0;
        while (!colocada && intentos < 100) {
            colocada = colocarPalabra(sopa, palabra, ocupadas);
            intentos++;
        }
        if (colocada) {
            coordenadasPalabras[palabra] = [];
            ocupadas.forEach(coord => {
                coordenadasPalabras[palabra].push(coord); // Agregar las coordenadas a la lista de la palabra
            });
        }
    });

    palabrasTotales = palabras.length;
}

// Función para rellenar la sopa de letras con letras aleatorias
function rellenarSopa(sopa) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    sopa.forEach((fila, i) => {
        fila.forEach((letra, j) => {
            if (letra === "") {
                const randomIndex = Math.floor(Math.random() * alphabet.length);
                sopa[i][j] = alphabet.charAt(randomIndex);
            }
        });
    });
}

// Función para mostrar la sopa de letras en la interfaz
function mostrarSopaDeLetras(sopa) {
    const tablaSopa = document.getElementById("tablaSopa");
    tablaSopa.innerHTML = "";
    sopa.forEach((fila, filaIndex) => {
        const tr = document.createElement("tr");
        fila.forEach((letra, colIndex) => {
            const td = document.createElement("td");
            td.textContent = letra;
            td.dataset.fila = filaIndex;
            td.dataset.columna = colIndex;
            tr.appendChild(td);
        });
        tablaSopa.appendChild(tr);
    });
}


// Función para mostrar las palabras en la lista de palabras
function mostrarPalabras(palabras) {
    const listaPalabras = document.getElementById("listaPalabras");
    listaPalabras.innerHTML = "";
    palabras.forEach(palabra => {
        const li = document.createElement("li");
        li.textContent = palabra;
        listaPalabras.appendChild(li);
    });
}

// Función para iniciar el juego
function iniciarJuego() {
    const dimensiones = 15;
    const palabras = generarPalabrasMedicina();
    const sopa = generarSopaDeLetras(dimensiones);
    colocarPalabras(sopa, palabras);
    rellenarSopa(sopa);
    mostrarSopaDeLetras(sopa);
    mostrarPalabras(palabras);

    const letras = document.querySelectorAll("#tablaSopa td");
    letras.forEach(letra => {
        letra.addEventListener("click", seleccionarLetra);
    });

    iniciarReloj();

}

// Función para manejar la selección de letras
function seleccionarLetra(event) {
    const fila = parseInt(event.target.dataset.fila);
    const columna = parseInt(event.target.dataset.columna);
    const coordenada = `${fila},${columna}`;

    let letraEncontrada = false;

    Object.entries(coordenadasPalabras).forEach(([palabra, coordenadas]) => {
        if (coordenadas.includes(coordenada)) {
            letraEncontrada = true;
            letrasCorrectas++;
        }
    });

    if (letraEncontrada) {
        event.target.classList.add('letra-correcta');
        event.target.classList.remove('letra-incorrecta');
    } else {
        event.target.classList.add('letra-incorrecta');
        setTimeout(() => {
            event.target.classList.remove('letra-incorrecta');
        }, 500);a
    }

    event.target.classList.add('letra-seleccionada');

    setTimeout(() => {
        event.target.classList.remove('letra-seleccionada');
    }, 500);

    let letrasCorrectasTotales = 0;
    Object.keys(coordenadasPalabras).forEach(palabra => {
        letrasCorrectasTotales += coordenadasPalabras[palabra].length;
    });

    if (letrasCorrectas === letrasCorrectasTotales) {
        detenerReloj();
        alert("¡Felicidades! Has encontrado todas las palabras.");
    }
}


// Iniciar el juego al cargar la página
window.addEventListener("load", iniciarJuego);

// Función para imprimir la sopa de letras
function imprimir() {
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write('<html><head><title>Sopa de letras - Imprimir</title>');
    ventanaImpresion.document.write('<link rel="stylesheet" href="../styles/styleJuego.css">');
    ventanaImpresion.document.write('</head><body>');
    ventanaImpresion.document.write('<div class="contenedor">');
    ventanaImpresion.document.write('<div class="juego">');
    ventanaImpresion.document.write('<div class="sopaDeLetras">');
    ventanaImpresion.document.write(document.querySelector(".sopaDeLetras").outerHTML);
    ventanaImpresion.document.write('</div>');
    ventanaImpresion.document.write(document.querySelector(".contenedor .palabras").outerHTML);
    ventanaImpresion.document.write('</div>');
    ventanaImpresion.document.write('</div>');
    ventanaImpresion.document.write('</body></html>');
    ventanaImpresion.document.close();
    ventanaImpresion.print();
}

// Función para generar palabras relacionadas con la medicina
function generarPalabrasMedicina() {
    const palabras = [
        "MEDICINA", "ENFERMERIA", "RADIOLOGIA", "CIRUGIA", "PACIENTE",
        "HOSPITAL", "EMERGENCIA", "DIAGNOSTICO", "TRATAMIENTO", "TERAPIA",
        "FARMACIA", "BACTERIA", "VIRUS", "ANATOMIA", "CUIDADO", "SALUD",
        "RECUPERACION", "CONSULTA", "EQUIPO", "QUIRURGICO", "AMBULANCIA",
        "URGENCIA", "REHABILITACION", "SINTOMA", "EXAMEN", "PREVENCION",
        "DETECCION", "INFECCION", "EPIDEMIA", "PANDEMIA", "VACUNA",
        "IMMUNIZACION", "CUIDADOR", "CONTROL", "OXIGENO", "TERAPEUTA",
        "RESONANCIA", "RADIOTERAPIA", "ANESTESIA", "QUIROFANO", "CUIDADOSO",
        "PROFESIONAL", "PULMONAR", "CARDIOLOGIA", "NEUROLOGIA", "GENETICA",
        "ONCOLOGIA", "GASTROENTEROLOGIA", "DERMATOLOGIA", "PEDIATRIA",
        "GERIATRIA", "OFTALMOLOGIA", "OTORRINOLARINGOLOGIA", "PSICOLOGIA",
        "NUTRICION", "FISIOTERAPIA", "SANGRE", "PLASMA", "CUIDADO",
        "CONVALECENCIA", "REHABILITACION", "TERAPIA", "RESCATE"
    ];
    // Filtrar las palabras para que tengan un máximo de 10 caracteres
    const palabrasCortas = palabras.filter(palabra => palabra.length <= 10);

    const palabrasAleatorias = [];

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * palabrasCortas.length);
        palabrasAleatorias.push(palabrasCortas[randomIndex]);
        palabrasCortas.splice(randomIndex, 1);
    }

    return palabrasAleatorias;
}
