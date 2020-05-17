import Snake from './snake.js';
import controlElem from './key-controls.js';

(function () {
    const canvas = document.getElementById('main-canvas');
    const ctx = canvas.getContext('2d');

    const snake = new Snake(ctx);
    snake.advanceSnake();

    // Game controls
    controlElem.addEventListener('game-controls', function (e) {
        snake.changeDirection(e.detail);
    }, false);
})();
