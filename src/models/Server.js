import EventEmitter from 'events';
import utils from '../utils';

// server will need to automate itself
// if a player leaves, an event should fire
// if a player joins, an event should fire

class Server {
    events;
    players = {};

    constructor (mode, region, spaces) {
        this.region = region;
        this.mode = mode;
        this.id = utils.makeHash(`${this.region} ${this.mode}`);
        this.maxSpaces = spaces;
        this.events = new EventEmitter();

        this.bindEvents();

        // this method simulates the leaving of players to the server
        // in this experiment players might leave a variable interval between 200ms and 1000ms
        this.simulateServer();
    }

    bindEvents () {
        this.events.on('playerLeft', (player) => {
            this.events.emit('updateServer', this);
        });
        this.events.on('playerJoined', (player) => {
            this.events.emit('updateServer', this);
        });
    }

    hasSpacesAvailable () {
        return this.playerCount() < this.maxSpaces;
    }

    shouldDelete () {
        return this.playerCount() > (this.maxSpaces * 0.5);
    }

    simulateServer () {
        let rand =  Math.floor(Math.random() * 800) + 200;
        setTimeout(() => {
            let playerKeys = Object.keys(this.players);
            let randomPlayer = playerKeys[Math.floor(Math.random() * playerKeys.length)];

            if(typeof this.players[randomPlayer] !== 'undefined' && this.shouldDelete()) {
                this.deletePlayer(this.players[randomPlayer]);
            }

            this.simulateServer();
        }, rand);
    }

    playerCount () {
        return Object.keys(this.players).length;
    }

    deletePlayer (player) {
        if(typeof this.players[player.id] !== 'undefined') {
            console.log(`Player '${player.id}' left server '${this.id}'`);
            delete this.players[player.id];
            this.events.emit('playerLeft');
        }
    }

    addPlayer (player) {
        player.currentServer = this.id;
        this.players[player.id] = player;
        this.events.emit('playerJoined', player);
        console.log(`Player '${player.id}' joined server '${this.id}'`);
    }

}

export default Server;
