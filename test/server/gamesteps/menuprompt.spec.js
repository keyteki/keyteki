const MenuPrompt = require('../../../server/game/gamesteps/menuprompt.js');
const Player = require('../../../server/game/player.js');

describe('the MenuPrompt', function() {
    beforeEach(function() {
        var game = new jasmine.createSpyObj('game', ['playerDecked', 'raiseEvent', 'addMessage']);

        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, game);
        this.player.initialise();
        this.otherPlayer = new Player('2', { username: 'Player 2', settings: {} }, false, game);
        this.otherPlayer.initialise();
        game.playersAndSpectators = {};
        game.playersAndSpectators[this.player.name] = this.player;
        game.playersAndSpectators[this.otherPlayer.name] = this.otherPlayer;

        this.contextObj = {
            doIt: function() {
                return true;
            },
            forbiddenMethod: function() {
                return true;
            }
        };
        spyOn(this.contextObj, 'doIt');
        spyOn(this.contextObj, 'forbiddenMethod');

        this.properties = {
            activePrompt: {
                buttons: [{ command: 'menuButton', text: 'Do it!', method: 'doIt' }]
            }
        };

        this.arg = 123;

        this.prompt = new MenuPrompt(game, this.player, this.contextObj, this.properties);
    });

    describe('the onMenuCommand() function', function() {
        describe('when the player is not the prompted player', function() {
            it('should return false', function() {
                expect(this.prompt.onMenuCommand(this.otherPlayer, this.arg, 'doIt')).toBe(false);
            });

            it('should not complete the prompt', function() {
                this.prompt.onMenuCommand(this.otherPlayer, this.arg, 'doIt');
                expect(this.prompt.isComplete()).toBe(false);
            });
        });

        describe('when the method does not exist', function() {
            it('should return false', function() {
                expect(this.prompt.onMenuCommand(this.player, this.arg, 'unknownMethod')).toBe(false);
            });

            it('should not complete the prompt', function() {
                this.prompt.onMenuCommand(this.player, this.arg, 'unknownMethod');
                expect(this.prompt.isComplete()).toBe(false);
            });
        });

        describe('when the method exists', function() {
            describe('when there is no button for the method', function() {
                it('should not call the specified method on the context object', function() {
                    this.prompt.onMenuCommand(this.player, this.arg, 'forbiddenMethod');
                    expect(this.contextObj.forbiddenMethod).not.toHaveBeenCalled();
                });

                it('should return false', function() {
                    expect(this.prompt.onMenuCommand(this.player, this.arg, 'forbiddenMethod')).toBe(false);
                });

                it('should not complete the prompt', function() {
                    this.prompt.onMenuCommand(this.player, this.arg, 'forbiddenMethod');
                    expect(this.prompt.isComplete()).toBe(false);
                });
            });

            describe('when the method has a corresponding button', function() {
                it('should call the specified method on the context object', function() {
                    this.prompt.onMenuCommand(this.player, this.arg, 'doIt');
                    expect(this.contextObj.doIt).toHaveBeenCalledWith(this.player, this.arg, 'doIt');
                });

                describe('when the method returns false', function() {
                    beforeEach(function() {
                        this.contextObj.doIt.and.returnValue(false);
                    });

                    it('should not complete the prompt', function() {
                        this.prompt.onMenuCommand(this.player, this.arg, 'doIt');
                        expect(this.prompt.isComplete()).toBe(false);
                    });

                    it('should return true', function() {
                        expect(this.prompt.onMenuCommand(this.player, this.arg, 'doIt')).toBe(true);
                    });
                });

                describe('when the method returns true', function() {
                    beforeEach(function() {
                        this.contextObj.doIt.and.returnValue(true);
                    });

                    it('should complete the prompt', function() {
                        this.prompt.onMenuCommand(this.player, this.arg, 'doIt');
                        expect(this.prompt.isComplete()).toBe(true);
                    });

                    it('should return true', function() {
                        expect(this.prompt.onMenuCommand(this.player, this.arg, 'doIt')).toBe(true);
                    });
                });
            });
        });
    });
});
