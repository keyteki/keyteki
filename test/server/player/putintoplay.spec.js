const _ = require('underscore');

const Player = require('../../../server/game/player.js');

xdescribe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['queueStep', 'raiseEvent', 'playerDecked', 'getPlayers', 'addMessage']);
        this.player = new Player('1', {username: 'Player 1', settings: {}}, true, this.gameSpy);
        this.player.initialise();

        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'moveTo', 'isUnique', 'applyPersistentEffects']);
        this.cardSpy.controller = this.player;
        this.cardSpy.owner = this.player;
        this.player.hand.push(this.cardSpy);
        this.cardSpy.location = 'hand';
        this.player.allCards.push(this.cardSpy);

        this.cardSpy.isUnique.and.returnValue(true);
        this.cardSpy.name = 'foo';
        this.existingCard = {
            location: 'play area',
            name: 'foo',
            controller: this.player,
            owner: this.player
        };

        this.opponent = new Player('2', {username: 'Player 2', settings: {}}, true, this.gameSpy);
        this.opponent.initialise();
        this.gameSpy.getPlayers.and.returnValue([this.player, this.opponent]);
    });

    describe('canPutIntoPlay()', function() {

        describe('when the player is the owner of the card', function() {
            describe('and the character is already in play', function() {
                beforeEach(function() {
                    this.player.allCards.push(this.existingCard);
                });

                it('should return false', function() {
                    expect(this.player.canPutIntoPlay(this.cardSpy)).toBe(false);
                });
            });

        });

        describe('when the player is not the owner of the card', function() {
            beforeEach(function() {
                this.cardSpy.owner = this.opponent;
            });

            describe('and the character is already in play', function() {
                beforeEach(function() {
                    this.player.allCards.push(this.existingCard);
                });

                it('should return false', function() {
                    expect(this.player.canPutIntoPlay(this.cardSpy)).toBe(false);
                });
            });

            describe('and the character is in play for the owner', function() {
                beforeEach(function() {
                    this.opponent.allCards.push(this.existingCard);
                    this.existingCard.owner = this.opponent;
                    this.existingCard.controller = this.opponent;
                });

                it('should return false', function() {
                    expect(this.player.canPutIntoPlay(this.cardSpy)).toBe(false);
                });
            });

        });
    });

    describe('putIntoPlay', function() {
        describe('when the playing type is dynasty', function() {
            describe('and the card is not a duplicate', function() {
                beforeEach(function() {
                    this.player.putIntoPlay(this.cardSpy);
                });

                it('should add the card to cards in play', function() {
                    expect(this.player.cardsInPlay).toContain(this.cardSpy);
                });

                it('should be marked as new', function() {
                    expect(this.cardSpy.new).toBe(true);
                });

                it('should raise the onCardEntersPlay event', function() {
                    expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardEntersPlay', jasmine.objectContaining({ card: this.cardSpy }));
                });
            });

            describe('and the card is a duplicate', function() {
                beforeEach(function() {
                    this.player.allCards.push(this.existingCard);
                    this.player.putIntoPlay(this.cardSpy);
                });

                it('should not add the card to cards in play', function() {
                    expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
                });

                it('should not raise the onCardEntersPlay event', function() {
                    expect(this.gameSpy.raiseEvent).not.toHaveBeenCalledWith('onCardEntersPlay', jasmine.objectContaining({ card: this.cardSpy }));
                });
            });
        });

        describe('when card is an attachment', function() {
            beforeEach(function() {
                spyOn(this.player, 'promptForAttachment');

                this.cardSpy.getType.and.returnValue('attachment');
            });

            describe('and there is no duplicate out', function() {
                beforeEach(function() {
                    this.player.putIntoPlay(this.cardSpy);
                });

                it('should prompt for attachment target', function() {
                    expect(this.player.promptForAttachment).toHaveBeenCalled();
                });

                it('should not remove the card from hand', function() {
                    expect(this.player.hand).toContain(this.cardSpy);
                });
            });

            describe('and there is a duplicate out', function() {
                beforeEach(function() {
                    this.player.allCards.push(this.existingCard);
                    this.player.putIntoPlay(this.cardSpy);
                });

                it('should not prompt for attachment target', function() {
                    expect(this.player.promptForAttachment).not.toHaveBeenCalled();
                });

                it('should not remove the card from hand', function() {
                    expect(this.player.hand).toContain(this.cardSpy);
                });

                it('should not add a new card to play', function() {
                    expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
                });
            });
        });

        describe('when the card is not controlled by the player', function() {
            beforeEach(function() {
                this.cardSpy.controller = this.opponent;
                this.cardSpy.owner = this.opponent;
                this.opponent.hand.push(this.cardSpy);
                this.player.hand = _([]);

                this.player.putIntoPlay(this.cardSpy);
            });

            it('should add the card to cards in play', function() {
                expect(this.player.cardsInPlay).toContain(this.cardSpy);
            });

            it('should remove the card from the other player', function() {
                expect(this.opponent.hand).not.toContain(this.cardSpy);
            });

            it('should transfer control to the player', function () {
                expect(this.cardSpy.controller).toBe(this.player);
            });
        });
    });
});
