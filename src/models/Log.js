import EventEmitter from 'events';

let logTemplate = require('../templates/log.njk');

class Log {
    log = [];

    constructor () {
        this.events = new EventEmitter();

        this.events.on('lineAdded', (line) => {
            let html = logTemplate.render({ log: this.log.slice(-1000) });
            document.getElementById('log').innerHTML = html;
        });
    }

    write (line) {
        this.log.push(line);
        this.events.emit('lineAdded', line);
    }
}

export default Log;
