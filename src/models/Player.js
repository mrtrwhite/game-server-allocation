import utils from '../utils';

class Player {
    constructor (id, mode, region) {
        this.id = id;
        this.mode = mode;
        this.region = region;

        this.serverCategory = `${this.region}-${this.mode}`;

        this.currentServer = '';
        this.createdAt = new Date();
        this.connectedAt = '';
    }
}

export default Player;
