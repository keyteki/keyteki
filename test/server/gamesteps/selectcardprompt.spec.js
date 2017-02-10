/*global describe, it, beforeEach, expect,spyOn, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');
const SelectCardPrompt = require('../../../server/game/gamesteps/selectcardprompt.js');

describe('the SelectCardPrompt', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['getPlayers']);

        this.player = jasmine.createSpyObj('player1', ['setPrompt', 'cancelPrompt']);
        this.player.cardsInPlay = _([]);
        this.otherPlayer = jasmine.createSpyObj('player2', ['setPrompt', 'cancelPrompt']);

        this.card = { controller: this.player };

        this.player.cardsInPlay.push(this.card);

        this.previousCard = { selected: true, controller: this.player };
        this.game.allCards = _([this.previousCard]);

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

        it('should unselect the cards when the prompt starts', function() {
            expect(this.previousCard.selected).toBe(false);
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

                describe('when the card is selected from a previous prompt', function() {
                    beforeEach(function() {
                        this.card.selected = true;
                    });

                    it('should not fire the onSelect event', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.properties.onSelect).not.toHaveBeenCalled();
                    });
                });

                describe('when onSelect returns true', function() {
                    beforeEach(function() {
                        this.properties.onSelect.and.returnValue(true);
                    });

                    it('should complete the prompt', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.prompt.isComplete()).toBe(true);
                    });

                    it('should reselect the card when the prompt is completed', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        this.prompt.continue();

                        expect(this.previousCard.selected).toBe(true);
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

                        it('should reselect the card when the prompt is completed', function() {
                            this.prompt.onMenuCommand(this.player, 'another');
                            this.prompt.continue();

                            expect(this.previousCard.selected).toBe(true);
                        });
                    });
                });
            });
        });
    });

    describe('for a multiple card prompt', function() {
        beforeEach(function() {
            this.card2 = {};
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

                describe('selecting a card owned by the prompted player', function() {
                    beforeEach(function() {
                        this.card.controller = this.player;
                    });

                    it('should select the card if it is not selected', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.card.selected).toBe(true);
                        expect(this.prompt.selectedCards).toContain(this.card);
                        expect(this.prompt.selectedCards.length).toBe(1);
                    });

                    it('should unselect the card if it is selected', function() {
                        this.card.selected = true;
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.card.selected).toBe(false);
                        expect(this.prompt.selectedCards).not.toContain(this.card);
                        expect(this.prompt.selectedCards.length).toBe(0);
                    });

                    it('should not opponent select the card if it is not selected', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.card.opponentSelected).toBeFalsy();
                    });

                    it('should not call onSelect', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.properties.onSelect).not.toHaveBeenCalled();
                    });
                });

                describe('selecting a card owned by another player', function() {
                    beforeEach(function() {
                        this.card.controller = this.otherPlayer;
                    });

                    it('should select the card if it is not selected', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.card.opponentSelected).toBe(true);
                        expect(this.prompt.selectedCards).toContain(this.card);
                        expect(this.prompt.selectedCards.length).toBe(1);
                    });

                    it('should unselect the card if it is selected', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.card.opponentSelected).toBeFalsy();
                        expect(this.prompt.selectedCards).not.toContain(this.card);
                        expect(this.prompt.selectedCards.length).toBe(0);
                    });

                    it('should not call onSelect', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.properties.onSelect).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when selecting unlimited cards', function() {
                beforeEach(function() {
                    this.properties.numCards = 0;
                    this.properties.cardCondition.and.returnValue(true);
                    this.prompt.onCardClicked(this.player, this.card);
                    this.prompt.onCardClicked(this.player, this.card2);
                    this.card3 = { controller: this.player };
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
                    this.card3 = {};
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
                        this.prompt.onMenuCommand(this.player, 'done');
                    });

                    it('should not complete the prompt', function() {
                        expect(this.prompt.isComplete()).toBe(false);
                    });

                    it('should clear selections', function() {
                        expect(this.card.selected).toBe(false);
                        expect(this.card2.selected).toBe(false);
                    });

                    it('should remove select cards on the prompt', function() {
                        expect(this.prompt.selectedCards.length).toBe(0);
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

    describe('multiple prompts', function() {
        beforeEach(function() {
            this.card2 = { controller: this.player };
            this.card3 = { controller: this.player };
            this.game.allCards = _([this.card, this.card2, this.card3]);
            this.properties = {
                cardCondition: () => true,
                onSelect: () => true,
                onMenuCommand: () => true,
                onCancel: () => true,
                numCards: 3
            };
            this.prompt = new SelectCardPrompt(this.game, this.player, this.properties);
        });

        describe('creating a new prompt in the middle of an existing prompt', function() {
            beforeEach(function() {
                this.prompt.onCardClicked(this.player, this.card);
                this.prompt.onCardClicked(this.player, this.card2);
                this.prompt2 = new SelectCardPrompt(this.game, this.otherPlayer, this.properties);
            });

            it('should clear existing selection', function() {
                expect(this.prompt2.selectedCards.length).toBe(0);
                expect(this.card.selected).toBe(false);
                expect(this.card2.selected).toBe(false);
            });

            describe('when the new prompt is completed', function() {
                beforeEach(function() {
                    this.prompt2.onCardClicked(this.otherPlayer, this.card);
                    this.prompt2.onCardClicked(this.otherPlayer, this.card2);
                    this.prompt2.onCardClicked(this.otherPlayer, this.card3);
                    this.prompt2.onMenuCommand(this.otherPlayer, 'done');
                });

                it('should restore selection for original prompt', function() {
                    expect(this.prompt.selectedCards.length).toBe(2);
                    expect(this.card.selected).toBe(true);
                    expect(this.card2.selected).toBe(true);
                    expect(this.card3.selected).toBe(false);
                });

                it('should handle clicking after restoration properly', function() {
                    this.prompt.onCardClicked(this.player, this.card);
                    expect(this.prompt.selectedCards.length).toBe(1);
                    expect(this.card.selected).toBe(false);
                    expect(this.card2.selected).toBe(true);
                    expect(this.card3.selected).toBe(false);
                });
            });
        });
    });
});
