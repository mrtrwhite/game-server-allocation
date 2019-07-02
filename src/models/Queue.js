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
            let html = queueTemplate.render({ player: player });
            document.getElementById('queue').insertAdjacentHTML('beforeend', html);
        });
    }

    push (player) {
        if(!this.queueObject[player.serverCategory]) {
            this.queueObject[player.serverCategory] = [];
        }
        this.queueObject[player.serverCategory].push(player);
        this.events.emit('playerAdded', player);
    }

    where (category, limit = 0) {
        if(this.queueObject[category]) {
            let list = this.queueObject[category].sort(this.sortByDate);

            if(limit) {
                return list.slice(0, limit);
            } else {
                return list;
            }
        }
        return [];
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

    sortByDate (a, b) {
        if (a.createdAt < b.createdAt) {
            return -1;
        }
        if (a.createdAt > b.createdAt) {
            return 1;
        }
        return 0;
    }
}

export default Queue;
