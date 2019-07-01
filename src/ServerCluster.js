import EventEmitter from 'events';
import utils from './utils';
import {modes, countries} from './PlayerGenerator';
import Server from './models/Server';

let serverTemplate = require('./templates/totals.njk');

class ServerCluster {
    events;
    cluster;

    constructor () {
        this.playersPerServer = 32;
        this.events = new EventEmitter();
        this.cluster = {};

        this.generateServers();
        this.bindEvents();
    }

    bindEvents () {
        this.events.on('serverUpdated', (server) => {
            let html = serverTemplate.render({ serverList: this.cluster });
            document.getElementById('app').innerHTML = html;
        });
    }

    generateServers () {
        let permutations = utils.cartesian(modes, countries);

        for(var p=0;p<permutations.length;p++) {
            let server = new Server(permutations[p][0], permutations[p][1], this.playersPerServer);
            this.cluster[server.id] = server;

            // this is weak
            this.cluster[server.id].events.on('updateServer', (server) => { this.updateServer(server); });
        }

        return this.cluster;
    }

    updateServer (server) {
        if(typeof this.cluster[server.id] !== 'undefined') {
            this.cluster[server.id] = server;
            this.events.emit('serverUpdated', server);
        }
    }

    firstWhere (hash) {
        if(typeof this.cluster[hash] !== 'undefined') {
            return this.cluster[hash];
        }
    }

    assignPlayer (player, server) {
        if(server.hasSpacesAvailable()) {
            server.addPlayer(player);
            this.events.emit('playerAssigned', player);
        }
    }

}

export default ServerCluster;
