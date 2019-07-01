import EventEmitter from 'events';

import utils from './utils';
import Player from './models/Player';

const modes = ['conquest', 'breakthrough', 'rush', 'tdm'];
const countries = ['GB', 'DE', 'US', 'FR'];

class PlayerGenerator {
    run = true;
    events;
    queue;

    constructor (interval, queue) {
        this.interval = interval;
        this.queue = queue;
        this.events = new EventEmitter();
        this.bindEvents();
    }

    bindEvents () {
        this.queue.events.on('playerAdded', (player) => {
            this.events.emit('playerAdded', player);
        });
    }

    makeRandomPlayer () {
        let id = utils.makeid(20);
        let mode = modes[Math.floor(Math.random() * modes.length)];
        let country = countries[Math.floor(Math.random() * countries.length)];

        return new Player(id, mode, country);
    }

    instantiateQueue () {
        setInterval(() => {
            if(this.run) {
                let player = this.makeRandomPlayer();
                this.queue.push(player);
            }
        }, this.interval);
    }

    stop () {
        this.run = false;
    }
}

export {
    modes,
    countries,
    PlayerGenerator
};
