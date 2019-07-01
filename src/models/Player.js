import utils from '../utils';

class Player {
    constructor (id, mode, region) {
        this.id = id;
        this.mode = mode;
        this.region = region;

        // in practice i'd imagine you'd generate a number between two ranges
        this.serverHash = utils.makeHash(`${this.region} ${this.mode}`);

        this.currentServer = '';
        this.createdAt = new Date();
        this.connectedAt = '';
    }
}

export default Player;
