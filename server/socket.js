const logger = require('./log.js');
const EventEmitter = require('events');
const jwt = require('jsonwebtoken');
const Raven = require('raven');

class Socket extends EventEmitter {
    constructor(socket, options = {}) {
        super();

        this.socket = socket;
        this.user = socket.request.user;
        this.config = options.config;

        socket.on('error', this.onError.bind(this));
        socket.on('authenticate', this.onAuthenticate.bind(this));
        socket.on('disconnect', this.onDisconnect.bind(this));
    }

    get id() {
        return this.socket.id;
    }

    // Commands
    registerEvent(event, callback) {
        this.socket.on(event, this.onSocketEvent.bind(this, callback));
    }

    joinChannel(channelName) {
        this.socket.join(channelName);
    }

    leaveChannel(channelName) {
        this.socket.leave(channelName);
    }

    send(message, ...args) {
        this.socket.emit(message, ...args);
    }

    disconnect() {
        this.socket.disconnect();
    }

    // Events
    onSocketEvent(callback, ...args) {
        if(!this.user) {
            return;
        }

        try {
            callback(this, ...args);
        } catch(err) {
            logger.info(err);
            Raven.captureException(err, { extra: args });
        }
    }

    onAuthenticate(token) {
        jwt.verify(token, this.config.secret, (err, user) => {
            if(err) {
                logger.info(err);
                return;
            }

            this.socket.request.user = user;
            this.user = user;
            this.emit('authenticate', user);
        });
    }

    onDisconnect() {
        this.emit('disconnect', this);
    }

    onError(err) {
        logger.info('Socket.IO error', err, '. Socket ID ', this.socket.id);
    }
}

module.exports = Socket;
