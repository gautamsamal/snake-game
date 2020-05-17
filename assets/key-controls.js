import { controls } from './constants.js';
const elem = document.createElement('div');

function filterKeys(keyCode) {
    if (keyCode === 32) {
        return controls.SPACE;
    }
    if (keyCode == 37) {
        return controls.LEFT;
    }
    if (keyCode == 38) {
        return controls.UP;
    }
    if (keyCode == 39) {
        return controls.RIGHT;
    }
    if (keyCode == 40) {
        return controls.DOWN;
    }
    return null;
}

document.addEventListener("keydown", function (e) {
    const keyInfo = filterKeys(e.keyCode);
    if (keyInfo) {
        e.preventDefault();
        e.stopPropagation();
        elem.dispatchEvent(new CustomEvent('game-controls', { detail: keyInfo }));
    }
}, false);

export default elem;
