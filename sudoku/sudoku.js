var numeroSeleccionado = null;
var celdaSeleccionada = null;

var errores = 0;

var tablero = generarSudoku(30); // 30 es la cantidad de números a eliminar
var solucion = JSON.parse(JSON.stringify(tablero)); // Copia del tablero para la solución
resolverSudoku(solucion); // Resuelve el tablero para obtener la solución

window.onload = function() {
    configurarJuego();
}

function configurarJuego() {
    // Dígitos 1-9
    for (let i = 1; i <= 9; i++) {
        let numero = document.createElement("div");
        numero.id = i;
        numero.innerText = i;
        numero.addEventListener("click", seleccionarNumero);
        numero.classList.add("numero");
        document.getElementById("digitos").appendChild(numero);
    }

    // Tablero 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.createElement("div");
            celda.id = r.toString() + "-" + c.toString();
            if (tablero[r][c] != 0) {
                celda.innerText = tablero[r][c];
                celda.classList.add("celda-inicial");
            }
            if (r == 2 || r == 5) {
                celda.classList.add("linea-horizontal");
            }
            if (c == 2 || c == 5) {
                celda.classList.add("linea-vertical");
            }
            celda.addEventListener("click", seleccionarCelda);
            celda.classList.add("celda");
            document.getElementById("tablero").append(celda);
        }
    }
}

function seleccionarNumero() {
    if (numeroSeleccionado != null) {
        numeroSeleccionado.classList.remove("numero-seleccionado");
    }
    numeroSeleccionado = this;
    numeroSeleccionado.classList.add("numero-seleccionado");
}

function seleccionarCelda() {
    if (numeroSeleccionado) {
        if (this.innerText != "") {
            return;
        }

        let coordenadas = this.id.split("-"); //["0", "0"]
        let r = parseInt(coordenadas[0]);
        let c = parseInt(coordenadas[1]);

        if (solucion[r][c] == numeroSeleccionado.id) {
            this.innerText = numeroSeleccionado.id;
        } else {
            errores += 1;
            document.getElementById("errores").innerText = errores;
        }
    }
}

// Funciones para la generación y resolución del Sudoku
function esSeguro(tablero, fila, columna, num) {
    for (let x = 0; x < 9; x++) {
        if (tablero[fila][x] == num || tablero[x][columna] == num || tablero[3 * Math.floor(fila / 3) + Math.floor(x / 3)][3 * Math.floor(columna / 3) + x % 3] == num) {
            return false;
        }
    }
    return true;
}

function resolverSudoku(tablero) {
    for (let fila = 0; fila < 9; fila++) {
        for (let columna = 0; columna < 9; columna++) {
            if (tablero[fila][columna] == 0) {
                for (let num = 1; num <= 9; num++) {
                    if (esSeguro(tablero, fila, columna, num)) {
                        tablero[fila][columna] = num;
                        if (resolverSudoku(tablero)) {
                            return true;
                        }
                        tablero[fila][columna] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function generarTableroCompleto() {
    let tablero = Array.from({ length: 9 }, () => Array(9).fill(0));
    resolverSudoku(tablero);
    return tablero;
}

function eliminarNumeros(tablero, dificultad) {
    let intentos = dificultad;
    while (intentos > 0) {
        let fila = Math.floor(Math.random() * 9);
        let columna = Math.floor(Math.random() * 9);
        while (tablero[fila][columna] == 0) {
            fila = Math.floor(Math.random() * 9);
            columna = Math.floor(Math.random() * 9);
        }
        tablero[fila][columna] = 0;
        intentos--;
    }
}

function generarSudoku(dificultad) {
    let tablero = generarTableroCompleto();
    eliminarNumeros(tablero, dificultad);
    return tablero;
}
