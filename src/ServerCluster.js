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
            this.renderServerList();
            this.orderCluster(server.category);
        });
        this.events.on('serverCreated', (server) => {
            this.renderServerList();
            this.orderCluster(server.category);
        });
    }

    renderServerList () {
        let html = serverTemplate.render({
            serverList: this.cluster
        });
        if(html) {
            document.getElementById('servers').innerHTML = html;
        }
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
                let players = this.queue.where(server.id, server.spacesAvailable());

                for(var i=0;i<players.length;i++) {
                    server.addPlayer(player);
                }
            });

            if(typeof this.cluster[server.category] == 'undefined') {
                this.cluster[server.category] = [];
            }

            this.cluster[server.category].push(server);
        }

        return this.cluster;
    }

    updateServer (server) {
        this.cluster[server.category][server.id] = server;
        this.events.emit('serverUpdated', server);
    }

    firstWhere (category) {
        if(typeof this.cluster[category] !== 'undefined') {
            return this.cluster[category][0];
        }
    }

    assignPlayer (player, server) {
        server.addPlayer(player);
        this.events.emit('playerAssigned', player);
    }

    //

    // optimal way to store servers in this.cluster?
    // need to quickly be able to find a server by matching game mode & region, with spaces available

    // {
    //   DE-tdm: [Server, Server]
    // }

    // 1) store servers in order of spaces available. this will need to update on every serverUpdated event.

    makeServer (mode, region) {
        let newServer = new Server(mode, region, this.playersPerServer);
        this.cluster[newServer.category].push(newServer);
        this.events.emit('serverCreated', newServer);
        this.log.write(`Server ${newServer.id} created`);
        return newServer;
    }

    orderCluster (category) {
        this.cluster[category] = this.cluster[category].sort(this.sortByPlayerCount);
    }

    sortByPlayerCount (a, b) {
        if (a.playerCount() < b.playerCount()) {
            return -1;
        }
        if (a.playerCount() > b.playerCount()) {
            return 1;
        }
        return 0;
    }

}

export default ServerCluster;
