import EventEmitter from 'events';
import utils from '../utils';

let queueTemplate = require('../templates/queue.njk');

class Queue {
    events;
    queueObject = {};

    constructor () {
        this.events = new EventEmitter();

        this.events.on('playerAdded', (player) => {
            let html = queueTemplate.render({ queue: utils.sliceEndOfObject(this.queueObject, 1000) });
            document.getElementById('queue').innerHTML = html;
        });
    }

    push (player) {
        this.queueObject[player.id] = player;
        this.events.emit('playerAdded', player);
    }

    firstWhere (hash) {
        for (var p in queueObject) {
            let player = queueObject[p];
            if(player.serverHash === hash) {
                return player;
                break;
            }
        }
    }

    getPlayer (id) {
        return this.queueObject[id];
    }

    deletePlayer (player) {
        if(typeof this.queueObject[player.id] !== 'undefined') {
            delete this.queueObject[player.id];
        }
    }
}

export default Queue;
