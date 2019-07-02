import EventEmitter from 'events';
import utils from '../utils';

let queueTemplate = require('../templates/queue.njk');

// can the queue be optimised?

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

    // slow
    where (category, limit = 0) {
        let list = [];

        for (var p in this.queueObject) {
            let player = this.queueObject[p];
            if(player.serverCategory === category) {
                list.push(player);
            }
        }

        if(limit) {
            return list.slice(0, limit);
        } else {
            return list;
        }
    }

    firstWhere (hash) {
        this.where(hash).slice(0, 1);
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
