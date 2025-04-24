let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'circle'; // Startspieler

function init() {
    render();
}
function render() {
    let container = document.getElementById('content');
    let html = '<table id="table">';

    for (let i = 0; i < 3; i++) {
        html += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let field = fields[index];
            let symbol = ''; // Diese Zeile fehlte!

            if (field === 'circle') {
                symbol = generateCircleSVG();
            } else if (field === 'cross') {
                symbol = generateCrossSVG();
            }

            html +=  `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
        }
        html += '</tr>';
    }

    html += '</table>';
    container.innerHTML = html;
}

function generateCircleSVG() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70"><circle cx="35" cy="35" r="25" stroke="#00B0EF" stroke-width="5" fill="none" stroke-dasharray="188.5" stroke-dashoffset="188.5" style="animation: drawCircle 1s ease-out forwards"/></svg>';
}

function generateCrossSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70">
        <line x1="15" y1="15" x2="55" y2="55" 
            stroke="#FFC000" 
            stroke-width="5" 
            stroke-linecap="round"
            style="animation: drawLine 0.5s ease-out forwards"
        />
        <line x1="55" y1="15" x2="15" y2="55" 
            stroke="#FFC000" 
            stroke-width="5" 
            stroke-linecap="round"
            style="animation: drawLine 0.5s ease-out forwards 0.5s"
        />
    </svg>`;
}

function handleClick(cell, index) {
    // Aktuellen Spielstein ins Array einfügen
    fields[index] = currentPlayer;
    
    // SVG ins TD-Element einfügen
    if (currentPlayer === 'circle') {
        cell.innerHTML = generateCircleSVG();
    } else {
        cell.innerHTML = generateCrossSVG();
    }
    
    // onClick-Handler entfernen
    cell.onclick = null;
    
    // Prüfen ob Spiel vorbei ist
    checkGameOver();
    
    // Spieler wechseln
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
}

function checkGameOver() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertikal
        [0, 4, 8], [2, 4, 6] // diagonal
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            let line;
            
            // Vertikale Linien
            if (combination.toString() === [0,3,6].toString()) {
                line = { x1: 51, y1: 50, x2: 51, y2: 260 };  // Erste Spalte
            } 
            else if (combination.toString() === [1,4,7].toString()) {
                line = { x1: 158, y1: 50, x2: 158, y2: 260 }; // Mittlere Spalte
            }
            else if (combination.toString() === [2,5,8].toString()) {
                line = { x1: 265, y1: 50, x2: 265, y2: 260 }; // Letzte Spalte
            }
            // Horizontale Linien
            else if (combination.toString() === [0,1,2].toString()) {
                line = { x1: 51, y1: 48, x2: 261, y2: 48 };   // Erste Reihe
            }
            else if (combination.toString() === [3,4,5].toString()) {
                line = { x1: 51, y1: 153, x2: 261, y2: 153 }; // Mittlere Reihe
            }
            else if (combination.toString() === [6,7,8].toString()) {
                line = { x1: 51, y1: 261, x2: 261, y2: 261 }; // Letzte Reihe
            }
            // Diagonale Linien
            else if (combination.toString() === [0,4,8].toString()) {
                line = { x1: 54, y1: 49, x2: 265, y2: 261 };  // Links oben nach rechts unten
            }
            else if (combination.toString() === [2,4,6].toString()) {
                line = { x1: 265, y1: 46, x2: 10, y2: 300 };  // Rechts oben nach links unten
            }

            drawWinningLine(line);
            setTimeout(() => {
                alert(`Herzlichen Glückwunsch! Spieler "${fields[a]}" hat gewonnen!`);
                resetGame();
            }, 1000);
            return;
        }
    }
    if (isGameDraw()) {
        setTimeout(() => {
            alert('Unentschieden!');
            resetGame();
        }, 1000);
    }
}

function isGameDraw() {
    return fields.every(field => field !== null);
}

function resetGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    currentPlayer = 'circle';
    render();
}


function drawWinningLine(line) {
    const table = document.getElementById('table');
    table.style.position = 'relative';
    
    const svg = `
        <svg class="winning-line" 
             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
            <line x1="${line.x1}" 
                  y1="${line.y1}" 
                  x2="${line.x2}" 
                  y2="${line.y2}" 
                  stroke="white" 
                  stroke-width="5"
                  stroke-linecap="round"
                  style="animation: drawWinningLine 0.5s ease-out forwards"
            />
        </svg>
    `;
    
    table.insertAdjacentHTML('beforeend', svg);
}
