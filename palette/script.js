function CurrentColor() {
    return window.getComputedStyle(document.getElementById('current_color'), null).getPropertyValue('background-color');
}
function Filling(arr) {
    arr.forEach((row) => {
        const rows = row;
        row.forEach((elem, index) => {
            rows[index] = CurrentColor();
        });
    });

    return arr;
}
function drawArray(size, arr) {
    const canvas = document.getElementsByTagName('canvas')[0];
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < arr.length; i += 1) {
        for (let j = 0; j < arr[i].length; j += 1) {
            ctx.fillStyle = arr[i][j];
            ctx.fillRect(j * (canvas.width / size),
                i * (canvas.width / size), (canvas.width / size), (canvas.width / size));
        }
    }
}
const smallImg = [
    ['#00BCD4', '#FFEB3B', '#FFEB3B', '#00BCD4'],
    ['#FFEB3B', '#FFC107', '#FFC107', '#FFEB3B'],
    ['#FFEB3B', '#FFC107', '#FFC107', '#FFEB3B'],
    ['#00BCD4', '#FFEB3B', '#FFEB3B', '#00BCD4'],
];
function LinearFunction(x0, y0, x1, y1) {
    const k = (y1 - y0) / (x1 - x0);
    const b = y0 - k * x0;
    return (x) => k * x + b;
}
const drawRect = function (x, y, width, height, color) {
    const canvas = document.getElementsByTagName('canvas')[0];
    const context = canvas.getContext('2d');
    context.beginPath();
    context.rect(x, y, width, height);
    context.fillStyle = typeof color === 'object' ? `rgba(${color.join(',')})` : `#${color}`;
    context.fill();
};
function Pencil(x0, y0, x1, y1, deltaX, deltaY) {
    let f = LinearFunction(x0, y0, x1, y1);
    const k = (y1 - y0) / (x1 - x0);
    const curColor = document.getElementById('current_color').value;
    if (Math.abs(k) < 1) {
        if (x1 > x0) {
            for (let x = x0; x < x1; x += deltaX) {
                const y = f(x);
                drawRect(x, y, deltaX, deltaY, curColor);
            }
        } else {
            for (let x = x0; x >= x1; x -= deltaX) {
                const y = f(x);
                drawRect(x, y, deltaX, deltaY, curColor);
            }
        }
    } else {
        f = LinearFunction(y0, x0, y1, x1);
        if (y1 > y0) {
            for (let y = y0; y < y1; y += deltaY) {
                const x = f(y);
                drawRect(x, y, deltaX, deltaY, curColor);
            }
        } else {
            for (let y = y0; y >= y1; y -= deltaY) {
                const x = f(y);
                drawRect(x, y, deltaX, deltaY, curColor);
            }
        }
    }
}

function ColorPicker(event, arr) {
    document.getElementById('prev_color').style.background = CurrentColor();
    localStorage.setItem('prev_color', CurrentColor());
    document.getElementById('current_color').style.background = arr[Math.floor(event.offsetY / 128)][Math.floor(event.offsetX / 128)];
    localStorage.setItem('current_color', CurrentColor());
}

window.onload = () => {
    let arr = localStorage.getItem('canvas') ? JSON.parse(localStorage.getItem('canvas')) : smallImg;
    drawArray(4, arr);
    const canvas = document.getElementsByTagName('canvas')[0];
    canvas.addEventListener('click', (event) => {
        switch (document.querySelector('.tools-block__tools_item_active').children[1].innerHTML) {
        case 'Pencil':
            Pencil(event, arr);
            drawArray(4, arr);
            break;
        case 'Choose color':
            ColorPicker(event, arr);
            break;
        case 'Paint bucket':
            arr = Filling(arr);
            drawArray(4, arr);
            break;
        default:
            break;
        }

        localStorage.setItem('canvas', JSON.stringify(arr));
    });

    canvas.addEventListener('mousemove', (event) => {
        if (event.which === 1 && document.getElementsByClassName('tools-block__tools_item_active')[0].children[1].innerHTML === 'Pencil') {
            arr[Math.floor(event.offsetY / 128)][Math.floor(event.offsetX / 128)] = CurrentColor();
            drawArray(4, arr);
            localStorage.setItem('canvas', JSON.stringify(arr));
        }
    });
};

Array.from(document.getElementsByClassName('tools-block__tools_item')).forEach((element) => {
    element.addEventListener('click', () => {
        document.getElementsByClassName('tools-block__tools_item_active')[0].classList.remove('tools-block__tools_item_active');

        element.classList.add('tools-block__tools_item_active');
    });
});

Array.from(document.getElementsByClassName('change')).forEach((element) => {
    element.addEventListener('click', () => {
        if (element.children[0].id !== 'prev_color') {
            document.getElementById('prev_color').style.background = CurrentColor();
            localStorage.setItem('prev_color', CurrentColor());
            document.getElementById('current_color').style.background = window.getComputedStyle(element.children[0], null).getPropertyValue('background-color');
            localStorage.setItem('current_color', CurrentColor());
        } else {
            document.getElementById('current_color').style.background = window.getComputedStyle(element.children[0], null).getPropertyValue('background-color');
        }
    });
});
document.getElementById('color_input').onchange = (event) => {
    document.getElementById('prev_color').style.background = CurrentColor();
    localStorage.setItem('prev_color', CurrentColor());
    document.getElementById('current_color').style.background = event.currentTarget.value;
    localStorage.setItem('current_color', CurrentColor());
};

document.addEventListener('keydown', (event) => {
    switch (event.key) {
    case 'b':
        document.getElementsByClassName('tools-block__tools_item_active')[0].classList.remove('tools-block__tools_item_active');
        document.getElementsByClassName('tools-block__tools_item')[0].classList.add('tools-block__tools_item_active');
        break;
    case 'p':
        document.getElementsByClassName('tools-block__tools_item_active')[0].classList.remove('tools-block__tools_item_active');
        document.getElementsByClassName('tools-block__tools_item')[2].classList.add('tools-block__tools_item_active');
        break;
    case 'c':
        document.getElementsByClassName('tools-block__tools_item_active')[0].classList.remove('tools-block__tools_item_active');
        document.getElementsByClassName('tools-block__tools_item')[1].classList.add('tools-block__tools_item_active');
        break;


    default:
        break;
    }
});
