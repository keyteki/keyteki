/*global describe, it, beforeEach, expect,spyOn*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const SelectCardPrompt = require('../../../server/game/gamesteps/selectcardprompt.js');
const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('the SelectCardPrompt', function() {
    beforeEach(function() {
        this.game = new Game('1', 'Test Game');
        this.player = new Player('1', 'Player 1', true, this.game);
        this.player.initialise();
        this.otherPlayer = new Player('2', 'Player 2', false, this.game);
        this.otherPlayer.initialise();
        this.game.players[this.player.id] = this.player;
        this.game.players[this.otherPlayer.id] = this.otherPlayer;
        this.card = new DrawCard(this.player, {});

        this.player.cardsInPlay.push(this.card);

        this.properties = {
            cardCondition: function() {
                return true;
            },
            onSelect: function() {
                return true;
            },
            onMenuCommand: function() {
                return true;
            },
            onCancel: function() {
                return true;
            }
        };
        spyOn(this.properties, 'cardCondition');
        spyOn(this.properties, 'onSelect');
        spyOn(this.properties, 'onMenuCommand');
        spyOn(this.properties, 'onCancel');
    });

    describe('for a single card prompt', function() {
        beforeEach(function() {
            this.properties.numCards = 1;
            this.prompt = new SelectCardPrompt(this.game, this.player, this.properties);
        });

        describe('the onCardClicked() function', function() {
            describe('when the player is not the prompted player', function() {
                it('should return false', function() {
                    expect(this.prompt.onCardClicked(this.otherPlayer, this.card)).toBe(false);
                });
            });

            describe('when the card does not match the allowed condition', function() {
                beforeEach(function() {
                    this.properties.cardCondition.and.returnValue(false);
                });

                it('should return false', function() {
                    expect(this.prompt.onCardClicked(this.player, this.card)).toBe(false);
                });
            });

            describe('when the card does match the condition', function() {
                beforeEach(function() {
                    this.properties.cardCondition.and.returnValue(true);
                });

                it('should call the onSelect event', function() {
                    this.prompt.onCardClicked(this.player, this.card);
                    expect(this.properties.onSelect).toHaveBeenCalledWith(this.player, this.card);
                });

                describe('when onSelect returns true', function() {
                    beforeEach(function() {
                        this.properties.onSelect.and.returnValue(true);
                    });

                    it('should complete the prompt', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.prompt.isComplete()).toBe(true);
                    });
                });

                describe('when onSelect returns false', function() {
                    beforeEach(function() {
                        this.properties.onSelect.and.returnValue(false);
                    });

                    it('should not complete the prompt', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.prompt.isComplete()).toBe(false);
                    });
                });
            });
        });

        describe('the onMenuCommand() function', function() {
            describe('when the player is not the prompted player', function() {
                it('should return false', function() {
                    expect(this.prompt.onMenuCommand(this.otherPlayer)).toBe(false);
                });
            });

            describe('when the player is the prompted player', function() {
                describe('when the done button is clicked', function() {
                    it('should call the onCancel event', function() {
                        this.prompt.onMenuCommand(this.player, 'done');
                        expect(this.properties.onCancel).toHaveBeenCalled();
                    });

                    it('should complete the prompt', function() {
                        this.prompt.onMenuCommand(this.player, 'done');
                        expect(this.prompt.isComplete()).toBe(true);
                    });
                });

                describe('when an additional button is clicked', function() {
                    it('should not call onSelect', function() {
                        this.prompt.onMenuCommand(this.player, 'another');
                        expect(this.properties.onSelect).not.toHaveBeenCalled();
                    });

                    it('should not call the onCancel event', function() {
                        this.prompt.onMenuCommand(this.player, 'another');
                        expect(this.properties.onCancel).not.toHaveBeenCalled();
                    });

                    it('should call the onMenuCommand event', function() {
                        this.prompt.onMenuCommand(this.player, 'another');
                        expect(this.properties.onMenuCommand).toHaveBeenCalledWith(this.player, 'another');
                    });

                    describe('when the menu handler returns false', function() {
                        beforeEach(function() {
                            this.properties.onMenuCommand.and.returnValue(false);
                        });

                        it('should not complete the prompt', function() {
                            this.prompt.onMenuCommand(this.player, 'another');
                            expect(this.prompt.isComplete()).toBe(false);
                        });
                    });

                    describe('when the menu handler returns true', function() {
                        beforeEach(function() {
                            this.properties.onMenuCommand.and.returnValue(true);
                        });

                        it('should complete the prompt', function() {
                            this.prompt.onMenuCommand(this.player, 'another');
                            expect(this.prompt.isComplete()).toBe(true);
                        });
                    });
                });
            });
        });
    });

    describe('for a multiple card prompt', function() {
        beforeEach(function() {
            this.card2 = new DrawCard(this.player, {});
            this.properties.numCards = 2;
            this.prompt = new SelectCardPrompt(this.game, this.player, this.properties);
        });

        describe('the onCardClicked() function', function() {
            describe('when the player is not the prompted player', function() {
                it('should return false', function() {
                    expect(this.prompt.onCardClicked(this.otherPlayer, this.card)).toBe(false);
                });
            });

            describe('when the card does not match the allowed condition', function() {
                beforeEach(function() {
                    this.properties.cardCondition.and.returnValue(false);
                });

                it('should return false', function() {
                    expect(this.prompt.onCardClicked(this.player, this.card)).toBe(false);
                });
            });

            describe('when the card does match the condition', function() {
                beforeEach(function() {
                    this.properties.cardCondition.and.returnValue(true);
                });

                it('should select the card if it is not selected', function() {
                    this.prompt.onCardClicked(this.player, this.card);
                    expect(this.card.selected).toBe(true);
                });

                it('should unselect the card if it is selected', function() {
                    this.card.selected = true;
                    this.prompt.onCardClicked(this.player, this.card);
                    expect(this.card.selected).toBe(false);
                });

                it('should not call onSelect', function() {
                    this.prompt.onCardClicked(this.player, this.card);
                    expect(this.properties.onSelect).not.toHaveBeenCalled();
                });
            });

            describe('when selecting unlimited cards', function() {
                beforeEach(function() {
                    this.properties.numCards = 0;
                    this.properties.cardCondition.and.returnValue(true);
                    this.prompt.onCardClicked(this.player, this.card);
                    this.prompt.onCardClicked(this.player, this.card2);
                    this.card3 = new DrawCard(this.player, {});
                });

                it('should select the card', function() {
                    this.prompt.onCardClicked(this.player, this.card3);
                    expect(this.card3.selected).toBe(true);
                });
            });

            describe('when selecting more cards than the numCards property', function() {
                beforeEach(function() {
                    this.properties.cardCondition.and.returnValue(true);
                    this.prompt.onCardClicked(this.player, this.card);
                    this.prompt.onCardClicked(this.player, this.card2);
                    this.card3 = new DrawCard(this.player, {});
                });

                it('should not select the card', function() {
                    this.prompt.onCardClicked(this.player, this.card3);
                    expect(this.card3.selected).toBeFalsy();
                });

                it('should return false', function() {
                    expect(this.prompt.onCardClicked(this.player, this.card3)).toBe(false);
                });
            });
        });

        describe('the onMenuCommand() function', function() {
            describe('when the player is not the prompted player', function() {
                it('should return false', function() {
                    expect(this.prompt.onMenuCommand(this.otherPlayer, 'done')).toBe(false);
                });
            });

            describe('when no cards have been selected', function() {
                it('should not call onSelect', function() {
                    this.prompt.onMenuCommand(this.player, 'done');
                    expect(this.properties.onSelect).not.toHaveBeenCalled();
                });

                it('should call the onCancel event', function() {
                    this.prompt.onMenuCommand(this.player, 'done');
                    expect(this.properties.onCancel).toHaveBeenCalled();
                });

                it('should complete the prompt', function() {
                    this.prompt.onMenuCommand(this.player, 'done');
                    expect(this.prompt.isComplete()).toBe(true);
                });
            });

            describe('when cards have been selected', function() {
                beforeEach(function() {
                    this.properties.cardCondition.and.returnValue(true);
                    this.prompt.onCardClicked(this.player, this.card);
                    this.prompt.onCardClicked(this.player, this.card2);
                });

                it('should not call the onCancel event', function() {
                    this.prompt.onMenuCommand(this.player, 'done');
                    expect(this.properties.onCancel).not.toHaveBeenCalled();
                });

                it('should call the onSelect event with an array of cards', function() {
                    this.prompt.onMenuCommand(this.player, 'done');
                    expect(this.properties.onSelect).toHaveBeenCalledWith(this.player, [this.card, this.card2]);
                });

                describe('when onSelect returns true', function() {
                    beforeEach(function() {
                        this.properties.onSelect.and.returnValue(true);
                    });

                    it('should complete the prompt', function() {
                        this.prompt.onMenuCommand(this.player, 'done');
                        expect(this.prompt.isComplete()).toBe(true);
                    });

                    it('should clear selection of the cards', function() {
                        this.prompt.onMenuCommand(this.player, 'done');
                        expect(this.card.selected).toBe(false);
                        expect(this.card2.selected).toBe(false);
                    });
                });

                describe('when onSelect returns false', function() {
                    beforeEach(function() {
                        this.properties.onSelect.and.returnValue(false);
                    });

                    it('should not complete the prompt', function() {
                        this.prompt.onMenuCommand(this.player, 'done');
                        expect(this.prompt.isComplete()).toBe(false);
                    });
                });
            });

            describe('when cards have been selected and unselected', function() {
                beforeEach(function() {
                    this.properties.cardCondition.and.returnValue(true);
                    this.prompt.onCardClicked(this.player, this.card);
                    this.prompt.onCardClicked(this.player, this.card2);
                    this.prompt.onCardClicked(this.player, this.card);
                });

                it('should call the onSelect event with only the cards still selected', function() {
                    this.prompt.onMenuCommand(this.player, 'done');
                    expect(this.properties.onSelect).toHaveBeenCalledWith(this.player, [this.card2]);
                });
            });
        });
    });
});
