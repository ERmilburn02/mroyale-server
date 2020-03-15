/* Container for connections. */
class Container {
    constructor(ws) {
        this.ws = ws;
    }

    onOpen(ws, req) {
        this.address = req.getHeader('x-forwarded-for');
        if (this.address == '') {
            this.address = Buffer.from(ws.getRemoteAddress()).slice(-4, 16); // HACK: For some reason, uWS keeps returning full 16 byte IP addresses... Wtf?
        }
    }

    onClose(ws, code, message) {
        console.log('Successfully closed connection!');
    }

    onTextMessage(ws, message) {
        console.log(`Text message recieved: ${message}`);
    }

    onBinaryMessage(ws, message) {
        console.log(`Binary message recieved: ${message}`);
    }
}

module.exports = Container;