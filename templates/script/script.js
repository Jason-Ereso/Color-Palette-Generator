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

function displayPalette(data) {
    const paletteDiv = document.getElementById('palette');
    paletteDiv.innerHTML = '';

    const colorTypes = ['original', 'complementary', 'analogous', 'triadic', 'tetradic', 'monochromatic'];
    colorTypes.forEach(type => {
        if (Array.isArray(data[type][0])) {
            data[type].forEach(color => {
                const colorSwatch = document.createElement('div');
                colorSwatch.className = 'color-swatch';
                colorSwatch.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                paletteDiv.appendChild(colorSwatch);
            });
        } else {
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.style.backgroundColor = `rgb(${data[type][0]}, ${data[type][1]}, ${data[type][2]})`;
            paletteDiv.appendChild(colorSwatch);
        }
    });
}

function changeBackgroundColor(rgb) {
    document.body.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}