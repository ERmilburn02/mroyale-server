const fs = require('fs');

if (!fs.existsSync('./config.json')) {
    console.error('Configuration was not found, exiting...');
    return;
}

const config = require('./config.json');

const uws = require('uWebSockets.js');
const app = uws.App();

const Container = require('./container');

function toString(buffer) {
    return Buffer.from(buffer).toString('utf8');
}

async function main(argv) {
    var server = this;

    app.ws('/*', {
        open: (ws, req) => {
            ws.container = new Container(server, ws);
            ws.container.onOpen(ws, req);
        },
        close: (ws, code, message) => { ws.container.onClose(ws, code, toString(message)) },
        message: (ws, message, isBinary) => {
            if (!isBinary) {
                ws.container.onTextMessage(ws, toString(message));
            } else {
                ws.container.onBinaryMessage(ws, message)
            }
        }
    });

    app.listen(config.port, (listenSocket) => {
        if (listenSocket) {
            console.log(`Listening on port = ${config.port}`);
        }
    });
}

main(process.argv.slice(2));