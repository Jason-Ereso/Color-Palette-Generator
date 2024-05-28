function updateCount(input) {
    var count = input.value.length;
    document.getElementById('count').textContent = count + "/25";
}

function generatePalette() {
    const name = document.getElementById('colorName').value;
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'name=' + encodeURIComponent(name)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        displayPalette(data);
        changeBackgroundColor(data.original);
    });
}

function generatePaletteFromHex() {
    const hex = document.getElementById('hexColor').value;
    fetch('/color_palette', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'color_value=' + encodeURIComponent(hex)
    })
    .then(response => response.json())
    .then(data => {
        displayPalette(data);
        changeBackgroundColor(data.original);
    });
}

function generatePaletteFromRGB() {
    const rgb = document.getElementById('rgbColor').value;
    fetch('/color_palette', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'color_value=' + encodeURIComponent(rgb)
    })
    .then(response => response.json())
    .then(data => {
        displayPalette(data);
        changeBackgroundColor(data.original);
    });
}

function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

async function generatePaletteFromRGBValues(rgb) {
    try {
        const response = await fetch('/color_palette', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ color_value: `${rgb[0]},${rgb[1]},${rgb[2]}` })
        });
        const colors = await response.json();
        displayPalette(colors);
        changeBackgroundColor(colors.original);
    } catch (error) {
        console.error('Error generating palette:', error);
    }
}

function generateRandomPalette() {
    const randomColor = getRandomColor();
    generatePaletteFromRGBValues(randomColor);
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return [r, g, b];
}

function displayPalette(data) {
    const paletteDiv = document.getElementById('palette');
    paletteDiv.innerHTML = '';

    const colorTypes = ['original', 'complementary', 'analogous', 'triadic', 'tetradic', 'monochromatic'];
    colorTypes.forEach(type => {
        const colors = Array.isArray(data[type][0]) ? data[type] : [data[type]];
        colors.forEach(color => {
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            const hexColor = rgbToHex(color[0], color[1], color[2]);
            colorSwatch.style.backgroundColor = rgbColor;
            colorSwatch.textContent = hexColor; // Display hex value inside color swatch
            paletteDiv.appendChild(colorSwatch);
        });
    });
}

function changeBackgroundColor(rgb) {
    document.body.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}