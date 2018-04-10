const _ = require('underscore');
const Player = require('../../../server/game/player.js');

describe('Player', () => {
    describe('drop()', function() {
        beforeEach(function() {
            this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'checkGameState', 'emitEvent', 'getOtherPlayer', 'raiseEvent']);

            this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
            spyOn(this.player, 'moveCard');

            this.gameSpy.playersAndSpectators = [];
            this.gameSpy.playersAndSpectators[this.player.name] = this.player;
            this.gameSpy.manualMode = true;

            this.cardSpy = jasmine.createSpyObj('card', ['getType', 'leavesPlay', 'moveTo']);
            this.cardSpy.uuid = '1111';
            this.cardSpy.controller = this.cardSpy.owner = this.player;
            this.cardSpy.type = 'character';
            this.cardSpy.attachments = _([]);
            this.cardSpy.isProvince = false;
        });

        describe('when dragging a card from hand to play area', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
            });

            describe('when the card is not in the hand', function() {
                beforeEach(function() {
                    this.cardSpy.location = 'conflict discard pile';
                    this.player.drop(this.cardSpy.uuid, 'hand', 'play area');
                });

                it('should not change the game state', function() {
                    expect(this.player.moveCard).not.toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and a character', function() {
                beforeEach(function() {
                    this.player.drop(this.cardSpy.uuid, 'hand', 'play area');
                });

                it('should add the card to the play area', function() {
                    expect(this.player.moveCard).toHaveBeenCalledWith(this.cardSpy, 'play area');
                });
            });

            describe('when the card is in hand and an event', function() {
                beforeEach(function() {
                    this.cardSpy.type = 'event';

                    this.player.drop(this.cardSpy.uuid, 'hand', 'play area');
                });

                it('should not add the card to the play area', function() {
                    expect(this.player.moveCard).not.toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.type = 'attachment';

                    this.player.drop(this.cardSpy.uuid, 'hand', 'play area');
                });

                it('should play the card', function() {
                    expect(this.player.moveCard).toHaveBeenCalledWith(this.cardSpy, 'play area');
                });
            });
        });

        describe('when dragging a card from hand to the conflict discard pile', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
            });

            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    this.cardSpy.location = 'play area';
                    this.player.drop(this.cardSpy.uuid, 'hand', 'conflict discard pile');
                });

                it('should not update the game state', function() {
                    expect(this.player.moveCard).not.toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.type = 'attachment';

                    this.player.drop(this.cardSpy.uuid, 'hand', 'conflict discard pile');
                });

                it('should update the game state', function() {
                    expect(this.player.moveCard).toHaveBeenCalledWith(this.cardSpy, 'conflict discard pile');
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.cardSpy.type = 'event';

                    this.player.drop(this.cardSpy.uuid, 'hand', 'conflict discard pile');
                });

                it('should update the game state', function() {
                    expect(this.player.moveCard).toHaveBeenCalledWith(this.cardSpy, 'conflict discard pile');
                });
            });

            describe('when the card is in hand and is a character', function() {
                beforeEach(function() {
                    this.player.drop(this.cardSpy.uuid, 'hand', 'conflict discard pile');
                });

                it('should update the game state', function() {
                    expect(this.player.moveCard).toHaveBeenCalledWith(this.cardSpy, 'conflict discard pile');
                });
            });
        });

        describe('when dragging a card from hand to the deck', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
            });

            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    this.cardSpy.location = 'play area';
                    this.player.drop(this.cardSpy, 'hand', 'conflict deck');
                });

                it('should not update the game state', function() {
                    expect(this.player.moveCard).not.toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.type = 'attachment';
                    this.player.drop(this.cardSpy.uuid, 'hand', 'conflict deck');
                });

                it('should update the game state', function() {
                    expect(this.player.moveCard).toHaveBeenCalledWith(this.cardSpy, 'conflict deck');
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.cardSpy.type = 'event';
                    this.player.drop(this.cardSpy.uuid, 'hand', 'conflict deck');
                });

                it('should update the game state', function() {
                    expect(this.player.moveCard).toHaveBeenCalledWith(this.cardSpy, 'conflict deck');
                });
            });

            describe('when the card is in hand and is a character', function() {
                beforeEach(function() {
                    this.player.drop(this.cardSpy.uuid, 'hand', 'conflict deck');
                });

                it('should update the game state', function() {
                    expect(this.player.moveCard).toHaveBeenCalledWith(this.cardSpy, 'conflict deck');
                });
            });
        });

        describe('when dragging a card from the play area to the conflict discard pile', function() {
            beforeEach(function() {
                this.player.cardsInPlay.push(this.cardSpy);
                this.cardSpy.location = 'play area';
            });

            describe('when the card is not in play', function() {
                beforeEach(function() {
                    this.cardSpy.location = 'hand';
                    this.player.drop(this.cardSpy.uuid, 'play area', 'conflict discard pile');
                });

                it('should not update the game state', function() {
                    expect(this.player.moveCard).not.toHaveBeenCalled();
                });
            });

            describe('when the card is in play', function() {
                beforeEach(function() {
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'play area', 'conflict discard pile');
                });

                it('should update the game state', function() {
                    expect(this.player.moveCard).toHaveBeenCalledWith(this.cardSpy, 'conflict discard pile');
                });
            });
        });

        describe('when dragging a card from the play area to the dynasty discard pile', function() {
            beforeEach(function() {
                this.player.cardsInPlay.push(this.cardSpy);
                this.cardSpy.location = 'play area';
            });

            describe('when the card is not in play', function() {
                beforeEach(function() {
                    this.player.drop('', 'play area', 'dynasty discard pile');
                });

                it('should not update the game state', function() {
                    expect(this.player.moveCard).not.toHaveBeenCalled();
                });
            });

            describe('when the card is in play', function() {
                beforeEach(function() {
                    this.player.drop(this.cardSpy.uuid, 'play area', 'dynasty discard pile');
                });

                it('should update the game state', function() {
                    expect(this.player.moveCard).toHaveBeenCalledWith(this.cardSpy, 'dynasty discard pile');
                });
            });
        });
    });
});
