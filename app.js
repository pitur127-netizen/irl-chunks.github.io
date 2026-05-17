// Inicjalizacja punktów (pobiera z pamięci telefonu lub daje 0)
let points = parseInt(localStorage.getItem('explorer_points')) || 0;
document.getElementById('points').innerText = points;

// Zbiór odkrytych kwadratów (żeby nie dostawać punktów dwa razy za to samo miejsce)
let visitedSquares = JSON.parse(localStorage.getItem('visited_squares')) || [];

// Funkcja przeliczająca GPS na kwadraty ok. 250m x 250m
// 1 stopień geograficzny to ok. 111 km. 250 metrów to około 0.00225 stopnia.
function getSquareCoords(lat, lon) {
    const squareSize = 0.00225; 
    const squareX = Math.floor(lat / squareSize);
    const squareY = Math.floor(lon / squareSize);
    return `${squareX}_${squareY}`;
}

function updateLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    document.getElementById('coordinates').innerText = `Twoja pozycja: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;

    // Oblicz kwadrat, w którym stoisz
    const currentSquare = getSquareCoords(lat, lon);

    // Jeśli kwadrat nie był jeszcze odwiedzony
    if (!visitedSquares.includes(currentSquare)) {
        visitedSquares.push(currentSquare);
        points += 100; // 100 punktów za nowy kwadrat

        // Zapisz zmiany w pamięci telefonu
        localStorage.setItem('visited_squares', JSON.stringify(visitedSquares));
        localStorage.setItem('explorer_points', points);

        // Aktualizuj widok
        document.getElementById('points').innerText = points;
        alert("Odblokowano nowy teren! +100 pkt");
    }
}

function handleError(error) {
    document.getElementById('coordinates').innerText = `Błąd GPS: ${error.message}`;
}

// Uruchomienie śledzenia pozycji użytkownika na żywo
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updateLocation, handleError, {
        enableHighAccuracy: true, // Wymusza dokładny GPS, a nie internetowy
        maximumAge: 10000,
        timeout: 5000
    });
} else {
    document.getElementById('coordinates').innerText = "Twoja przeglądarka nie wspiera GPS.";
}