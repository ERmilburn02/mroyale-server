const Match = require('./match');
const Player = require('./player');

class Container {
    constructor(server, ws) {
        this.server = server;
        this.ws = ws;
    }

    onOpen(ws, req) {
        this.address = req.getHeader('x-forwarded-for');
        if (!this.address) {
            this.address = Buffer.from(ws.getRemoteAddress()).slice(-4, 16); // HACK: For some reason, uWS keeps returning full 16 byte IP addresses. Wtf?
        }

        this.setState('l'); // Login
    }

    onClose(ws, code, message) {
        console.log('Successfully closed connection!');
    }

    send(json) {
        this.ws.send(JSON.stringify(json))
    }

    login() {
        this.send({packets: [
            {name: this.player.name, team: this.player.team, skin: this.player.skin, type: "l01"}
        ], type: "s01"});
    }

    setState(state) {
        this.state = this.pendingState = state;
        this.send({packets: [
            {state: this.state, type: "s00"}
        ], type: "s01"});
    }

    onTextMessage(ws, message) {
        message = JSON.parse(message);

        switch (this.state) {
            case 'l':
                switch (message.type) {
                    case 'l00':
                        this.player = new Player(
                            this, new Match(this.server, true, '', 0),
                            'Mario', '',
                            0, 0
                        );

                        this.login();
                        this.setState('g'); // In-game
                        break;
                }
                break;

            case 'g':
                switch (message.type) {
                    case 'g00':
                        this.pendingState = null;
                        this.player.onEnterIngame();
                        break;
                }
                break;
        }
    }

    onBinaryMessage(ws, message) {
        console.log(`Binary message recieved: ${message}`);
    }
}

module.exports = Container;