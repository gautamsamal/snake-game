onmessage = function (e) {
    const { type, ...args } = e.data;

    if (type === 'calculateRandomFood') {
        const { bitsToSkip, xMin, yMin, xMax, yMax, roundOff } = args;
        const result = calculateRandomFood(bitsToSkip, xMin, yMin, xMax, yMax, roundOff);
        postMessage({ type, ...result });
    }
}

postMessage('Math worker initialized!');


function calculateRandomFood(bitsToSkip, xMin, yMin, xMax, yMax, roundOff) {
    const x = randomIntFromInterval(xMin, xMax, roundOff);
    const y = randomIntFromInterval(yMin, yMax, roundOff);

    // Check if it comes in the path of snake.
    if (bitsToSkip.find(s => checkValueInBetween(x, s.x, s.x + s.width) && checkValueInBetween(y, s.y, s.y + s.height))) {
        return calculateRandomFood(bitsToSkip, xMin, yMin, xMax, yMax);
    }
    return { x, y };
}

function randomIntFromInterval(min, max, roundOff) { // excluding max. Returns a nearest roundOff number.
    const random = Math.floor(Math.random() * (max - min) + min);
    return random - random % roundOff;
}

function checkValueInBetween(value, min, max) {
    return value >= min && value <= max;
}
