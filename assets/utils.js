const mathWorker = new Worker('assets/workers/math.js');
let mathActiveRequest;
let mathActiveCallback;
mathWorker.onmessage = function (e) {
    mathActiveRequest = null;
    console.log('Math: ' + JSON.stringify(e.data));

    if (mathActiveCallback) {
        mathActiveCallback(e.data);
    }
};

export default class Utils {
    static setUpTimer(schedule, interval) {
        const timerWorker = new Worker('assets/workers/timer.js');
        timerWorker.onmessage = function (e) {
            if (e.data == 'tick') {
                schedule();
            }
            else
                console.log('Timer: ' + e.data);
        };
        if (interval)
            timerWorker.postMessage({ 'interval': interval });
        return timerWorker;
    }

    static doMathWork(type, data, callback) {
        if (mathActiveRequest) {
            console.warn('One active request is already in progress');
            return callback(new Error('One active request is already in progress'));
        }
        mathActiveCallback = callback;
        mathWorker.postMessage({ type, ...data });
    }
}
