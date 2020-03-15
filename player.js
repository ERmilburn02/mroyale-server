class Player {
    constructor(container, match, name, team, skinId, gameMode) {
        this.container = container;
        this.match = match;
        this.name = name;
        this.team = team;
        this.skinId = skinId;
        this.gameMode = gameMode;
        
        this.level = 0;
        this.zone = 0;
        this.position = {x: 0, y: 0};
        this.dead = true;
        this.wins = 0;
        this.deaths = 0;
        this.kills = 0;
        this.coins = 0;
    }

    send(json) {
        this.container.send(json);
    }

    loadWorld(name, message) {
        // pendingWorld
        this.send(message);
    }

    onEnterIngame() {
        this.loadWorld('', this.match.getLoadMessage());
        this.container.ws.send(new Uint8Array([0x02, 0x00, 0x00, 0x00, 0x00, 0x00]), true);
    }
}

module.exports = Player;