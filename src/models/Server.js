import EventEmitter from 'events';
import utils from '../utils';

class Server {
    events;
    players = {};
    avgWait = 0;
    formattedAvgWait = 0;
    canLeave = false;

    constructor (mode, region, spaces) {
        this.region = region;
        this.mode = mode;
        this.id = utils.makeid(16);
        this.category = `${this.region}-${this.mode}`;
        this.maxSpaces = spaces;
        this.events = new EventEmitter();

        this.bindEvents();

        // this method simulates players disconnecting
        // in this experiment players might leave a variable interval between 200ms and 1000ms
        this.simulateServer();

        this.pollForSpaces();
    }

    bindEvents () {
        this.events.on('playerLeft', (player) => {
            this.events.emit('updateServer', this);

            if(this.hasSpacesAvailable()) {
                this.events.emit('spacesAvailable', this);
            }
        });

        this.events.on('playerJoined', (player) => {
            this.events.emit('updateServer', this);

            this.updateAvgWait(player.connectedAt - player.createdAt);

            if(this.playerCount() == this.maxSpaces) {
                this.canLeave = true;
            }
        });
    }

    spacesAvailable () {
        return this.maxSpaces - this.playerCount();
    }

    hasSpacesAvailable () {
        return this.spacesAvailable() > 0;
    }

    simulateServer () {
        let rand =  utils.getRandomInt(5000, 10000);
        setTimeout(() => {
            if(this.canLeave) {
                let playerKeys = Object.keys(this.players);
                let randomPlayer = playerKeys[Math.floor(Math.random() * playerKeys.length)];

                if(typeof this.players[randomPlayer] !== 'undefined') {
                    this.deletePlayer(this.players[randomPlayer]);
                }
            }

            this.simulateServer();
        }, rand);
    }

    // every second check for empty spaces
    pollForSpaces () {
        setInterval(() => {
            if(this.hasSpacesAvailable()) {
                this.events.emit('spacesAvailable', this);
            }
        }, 1000);
    }

    playerCount () {
        return Object.keys(this.players).length;
    }

    deletePlayer (player) {
        if(typeof this.players[player.id] !== 'undefined') {
            this.events.emit('log', `Player '${player.id}' left server '${this.id}'`);
            delete this.players[player.id];
            this.events.emit('playerLeft');
        }
    }

    addPlayer (player) {
        player.currentServer = this.id;
        player.connectedAt = new Date();
        this.players[player.id] = player;
        this.events.emit('playerJoined', player);
        this.events.emit('log', `Player '${player.id}' joined server '${this.id}'`);
    }

    updateAvgWait (wait) {
        this.avgWait = (this.avgWait + wait) / 2;
        this.formattedAvgWait = Math.round(this.avgWait * 100) / 100;
    }

}

export default Server;
