import EventEmitter from 'events';
import utils from '../utils';

let queueTemplate = require('../templates/queue.njk');

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

    slice (items, start, end) {
        start = start || 0;
        var len = items.length;
        var arr = new Array(end - start);

        for (var i = start; i < end; i++){
            arr[i - start] = items[i];
        }

        return arr;
    }

    firstWhere (category) {
        return this.queueObject[category].sort(this.sortByDate)[0];
    }

    getPlayer (id) {
        return this.queueObject[id];
    }

    // slow
    // deletePlayer (player) {
    //     if(typeof this.queueObject[player.serverCategory] !== 'undefined') {
    //         let index = this.queueObject[player.serverCategory].findIndex((p) => p.id === player.id);
    //         delete this.queueObject[player.serverCategory][index];
    //     }
    // }

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
