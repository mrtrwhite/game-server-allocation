import EventEmitter from 'events';

class Queue {
    events;
    queueObject = {};

    constructor () {
        this.events = new EventEmitter();
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
