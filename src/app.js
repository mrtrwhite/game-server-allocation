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

    console.log(server.hasSpacesAvailable());

    if(server && server.hasSpacesAvailable()) {
        server.addPlayer(player);
    }
});

serverCluster.events.on('playerAssigned', (player) => {
    queue.deletePlayer(player);
});
