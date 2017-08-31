const Lobby = require('../../../server/lobby.js');
const _ = require('underscore');

describe('lobby', function() {
    beforeEach(function() {
        this.socketSpy = jasmine.createSpyObj('socket', ['joinChannel', 'send']);
        this.ioSpy = jasmine.createSpyObj('io', ['set', 'use', 'on', 'emit']);
        this.routerSpy = jasmine.createSpyObj('router', ['on']);

        this.socketSpy.user = { username: 'test'};
        this.socketSpy.id = 'socket1';

        this.lobby = new Lobby({}, { io: this.ioSpy, cardService: {}, messageRepository: {}, deckRepository: {}, router: this.routerSpy, config: {} });
        this.lobby.sockets[this.socketSpy.id] = this.socketSpy;
    });

    describe('onNewGame', function() {
        describe('when called once', function() {
            beforeEach(function() {
                this.lobby.onNewGame(this.socketSpy, {});
            });

            it('should create a new game with the player in it', function() {
                expect(_.size(this.lobby.games)).toBe(1);
                var gamesArray = _.toArray(this.lobby.games);
                var player = gamesArray[0].players['test'];

                expect(player.name).toBe('test');
            });
        });

        describe('when called twice', function() {
            beforeEach(function() {
                this.lobby.onNewGame(this.socketSpy, {});
                this.lobby.onNewGame(this.socketSpy, {});
            });

            it('should only create 1 game', function() {
                expect(_.size(this.lobby.games)).toBe(1);
            });
        });
    });
});
