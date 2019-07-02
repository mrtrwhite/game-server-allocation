import {PlayerGenerator} from './PlayerGenerator';
import ServerCluster from './ServerCluster';
import Queue from './models/Queue';

const queue = new Queue();
const generator = new PlayerGenerator(100, queue);
const serverCluster = new ServerCluster(queue);

generator.instantiateQueue();

// check whether server is available with spaces
// else leave in queue until space becomes available
generator.events.on('playerAdded', (player) => {
    let server = serverCluster.firstWhere(player.serverCategory);

    if(server) {
        if(server.hasSpacesAvailable()) {
            server.addPlayer(player);
        } else {
            let server = serverCluster.makeServer(player.mode, player.region);
            server.addPlayer(player);
        }
    }
});

serverCluster.events.on('playerAssigned', (player) => {
    queue.deletePlayer(player);
});
