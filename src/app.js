import {PlayerGenerator} from './PlayerGenerator';
import ServerCluster from './ServerCluster';
import Queue from './models/Queue';

const queue = new Queue();
const generator = new PlayerGenerator(100, queue);
const serverCluster = new ServerCluster();

generator.instantiateQueue();

// check whether server is available with spaces
// else leave in queue until space becomes available
generator.events.on('playerAdded', (player) => {
    let server = serverCluster.firstWhere(player.serverHash);

    if(server) {
        server.addPlayer(player);
    }
});

serverCluster.events.on('playerAssigned', (player) => {
    queue.deletePlayer(player);
});
