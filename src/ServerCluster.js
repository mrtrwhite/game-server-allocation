import EventEmitter from 'events';
import utils from './utils';
import {modes, countries} from './PlayerGenerator';
import Server from './models/Server';
import Log from './models/Log';

let serverTemplate = require('./templates/server-totals.njk');

class ServerCluster {
    events;
    cluster;

    constructor (queue) {
        this.queue = queue;
        this.playersPerServer = 16;
        this.events = new EventEmitter();
        this.cluster = {};
        this.log = new Log();

        this.generateServers();
        this.bindEvents();
    }

    bindEvents () {
        this.events.on('serverUpdated', (server) => {
            let html = serverTemplate.render({
                serverList: this.cluster
            });
            document.getElementById('servers').innerHTML = html;
        });
    }

    generateServers () {
        let permutations = utils.cartesian(modes, countries);

        for(var p=0;p<permutations.length;p++) {
            let server = new Server(permutations[p][0], permutations[p][1], this.playersPerServer);

            // this is weak
            server.events.on('updateServer', (server) => {
                this.updateServer(server);
            });

            server.events.on('log', (line) => {
                this.log.write(line);
            });

            server.events.on('spacesAvailable', (server) => {
                // this.log.write(`Spaces available on server ${server.id}`);
                let players = this.queue.where(server.id, server.spacesAvailable());

                for(var i=0;i<players.length;i++) {
                    server.addPlayer(player);
                }
            });

            this.cluster[server.id] = server;
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
