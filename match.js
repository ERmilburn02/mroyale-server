const lobby = require('./lobby.json');

class Match {
    constructor(server, _private, team, gameMode) {
        this.server = server;
        this.private = _private;
        this.team = team;
        this.gameMode = gameMode;

        this.world = 'custom';
    }

    getLoadMessage() {
        var packet = {game: this.world, type: "g01"};
        packet.levelData = JSON.stringify(lobby);
        return {packets: [packet], type: "s01"};
    }
}

module.exports = Match;