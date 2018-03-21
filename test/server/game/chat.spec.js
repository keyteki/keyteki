const Game = require('../../../server/game/game.js');
const Spectator = require('../../../server/game/spectator.js');

describe('Game', function() {
    beforeEach(function() {
        this.gameService = jasmine.createSpyObj('gameService', ['save']);
        this.game = new Game('1', 'Test Game', { gameService: this.gameService });

        this.player = jasmine.createSpyObj('player', ['']);
        this.player.name = 'Player 1';

        this.game.playersAndSpectators[this.player.name] = this.player;

        this.chatCommands = this.game.chatCommands;
        this.gameChat = this.game.gameChat;
        spyOn(this.chatCommands, 'executeCommand').and.returnValue(false);
        spyOn(this.gameChat, 'addChatMessage');
    });

    describe('chat()', function() {
        describe('when called by a player not in the game', function() {
            it('should not add any chat messages', function() {
                this.game.chat('notinthegame', 'Test Message');

                expect(this.gameChat.addChatMessage).not.toHaveBeenCalled();
            });
        });

        describe('when called by a player in the game', function() {
            describe('and the message is a command', function() {
                beforeEach(function() {
                    this.chatCommands.executeCommand.and.returnValue(true);

                    this.game.chat(this.player.name, '/this is a command');
                });

                it('should execute the command', function() {
                    expect(this.chatCommands.executeCommand).toHaveBeenCalledWith(this.player, '/this', ['/this', 'is', 'a', 'command']);
                });

                it('should not add any chat messages', function() {
                    expect(this.gameChat.addChatMessage).not.toHaveBeenCalled();
                });
            });

            describe('and the message is a not a valid command', function() {
                beforeEach(function() {
                    this.chatCommands.executeCommand.and.returnValue(false);

                    this.game.chat(this.player.name, 'this is a message');
                });

                it('should add the chat messages', function() {
                    expect(this.gameChat.addChatMessage).toHaveBeenCalledWith(jasmine.any(String), this.player, 'this is a message');
                });
            });
        });

        describe('when called by a spectator in the game', function() {
            beforeEach(function() {
                this.player.constructor = Spectator;
            });

            describe('and the message is a command', function() {
                beforeEach(function() {
                    this.chatCommands.executeCommand.and.returnValue(true);

                    this.game.chat(this.player.name, '/this is a command');
                });

                it('should not execute the command', function() {
                    expect(this.chatCommands.executeCommand).not.toHaveBeenCalled();
                });

                it('should add it as a chat messages', function() {
                    expect(this.gameChat.addChatMessage).toHaveBeenCalledWith(jasmine.any(String), this.player, '/this is a command');
                });
            });

            describe('and the message is a not a valid command', function() {
                beforeEach(function() {
                    this.chatCommands.executeCommand.and.returnValue(false);

                    this.game.chat(this.player.name, 'this is a message');
                });

                it('should add the chat messages', function() {
                    expect(this.gameChat.addChatMessage).toHaveBeenCalledWith(jasmine.any(String), this.player, 'this is a message');
                });
            });
        });
    });
});
