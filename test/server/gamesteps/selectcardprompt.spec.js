/*global describe, it, beforeEach, expect,spyOn, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');
const SelectCardPrompt = require('../../../server/game/gamesteps/selectcardprompt.js');

describe('the SelectCardPrompt', function() {
    function createCardSpy(properties = {}) {
        let card = jasmine.createSpyObj('card', ['allowGameAction', 'getType']);
        card.getType.and.returnValue('character');
        card.allowGameAction.and.returnValue(true);
        _.extend(card, properties);
        return card;
    }

    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['getPlayers']);

        this.player = jasmine.createSpyObj('player1', ['setPrompt', 'cancelPrompt', 'clearSelectableCards', 'clearSelectedCards', 'setSelectableCards', 'setSelectedCards']);
        this.player.cardsInPlay = _([]);
        this.otherPlayer = jasmine.createSpyObj('player2', ['setPrompt', 'cancelPrompt', 'clearSelectableCards', 'clearSelectedCards', 'setSelectableCards', 'setSelectedCards']);
        this.card = createCardSpy({ controller: this.player });


        this.player.cardsInPlay.push(this.card);

        this.previousCard = createCardSpy({ selected: true, controller: this.player });
        this.player.selectedCards = [this.previousCard];

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

    describe('constructor', function() {
        describe('cardType', function() {
            it('should default to a list of draw card types', function() {
                let prompt = new SelectCardPrompt(this.game, this.player, this.properties);
                expect(prompt.properties.cardType).toEqual(['attachment', 'character', 'event', 'location', 'holding']);
            });

            it('should let a custom array be set', function() {
                this.properties.cardType = ['foo'];
                let prompt = new SelectCardPrompt(this.game, this.player, this.properties);
                expect(prompt.properties.cardType).toEqual(['foo']);
            });

            it('should let a non-array be set', function() {
                this.properties.cardType = 'foo';
                let prompt = new SelectCardPrompt(this.game, this.player, this.properties);
                expect(prompt.properties.cardType).toEqual(['foo']);
            });
        });
    });

    describe('for a single card prompt', function() {
        beforeEach(function() {
            this.properties.numCards = 1;
            this.prompt = new SelectCardPrompt(this.game, this.player, this.properties);
        });

        it('should unselect the cards when the prompt starts', function() {
            expect(this.player.clearSelectedCards).toHaveBeenCalled();
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

            describe('when the specified game action is not allowed for the target', function() {
                beforeEach(function() {
                    this.card.allowGameAction.and.returnValue(false);
                });

                it('should return false', function() {
                    expect(this.prompt.onCardClicked(this.player, this.card)).toBe(false);
                });
            });

            describe('when the card is not of the correct type', function() {
                beforeEach(function() {
                    this.properties.cardCondition.and.returnValue(true);
                    this.card.getType.and.returnValue('character');
                    this.prompt.properties.cardType = ['event'];
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

                    it('should reselect the card when the prompt is completed', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        this.prompt.continue();

                        expect(this.player.setSelectedCards).toHaveBeenCalledWith([this.previousCard]);
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
            this.card2 = createCardSpy();
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
                        expect(this.player.setSelectedCards).toHaveBeenCalledWith([this.card]);
                        expect(this.prompt.selectedCards).toContain(this.card);
                        expect(this.prompt.selectedCards.length).toBe(1);
                    });

                    it('should unselect the card if it is selected', function() {
                        this.prompt.selectedCards = [this.card];
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.player.setSelectedCards).toHaveBeenCalledWith([]);
                        expect(this.prompt.selectedCards).not.toContain(this.card);
                        expect(this.prompt.selectedCards.length).toBe(0);
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
                        expect(this.player.setSelectedCards).toHaveBeenCalledWith([this.card]);
                        expect(this.prompt.selectedCards).toContain(this.card);
                        expect(this.prompt.selectedCards.length).toBe(1);
                    });

                    it('should unselect the card if it is selected', function() {
                        this.prompt.onCardClicked(this.player, this.card);
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.player.setSelectedCards).toHaveBeenCalledWith([]);
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
                    this.card3 = createCardSpy({ controller: this.player });
                });

                it('should select the card', function() {
                    this.prompt.onCardClicked(this.player, this.card3);
                    expect(this.player.setSelectedCards).toHaveBeenCalledWith([this.card, this.card2, this.card3]);
                });
            });

            describe('when selecting more cards than the numCards property', function() {
                beforeEach(function() {
                    this.properties.cardCondition.and.returnValue(true);
                    this.prompt.onCardClicked(this.player, this.card);
                    this.prompt.onCardClicked(this.player, this.card2);
                    this.card3 = createCardSpy();
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
                        expect(this.player.clearSelectedCards).toHaveBeenCalled();
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
                        expect(this.player.clearSelectedCards).toHaveBeenCalled();
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

    describe('for stat-based prompts', function() {
        beforeEach(function() {
            this.maxStatSpy = jasmine.createSpy('maxStat');
            this.maxStatSpy.and.returnValue(1);
            this.cardStatSpy = jasmine.createSpy('cardStat');
            this.properties.maxStat = this.maxStatSpy;
            this.properties.cardStat = this.cardStatSpy;
            this.prompt = new SelectCardPrompt(this.game, this.player, this.properties);
        });

        describe('checkCardCondition()', function() {
            beforeEach(function() {
                this.properties.cardCondition.and.returnValue(true);
                this.card.getType.and.returnValue('character');
            });

            describe('when the card is not selected', function() {
                beforeEach(function() {
                    this.prompt.selectedCards = [];
                });

                describe('and the card will not put it past the max', function() {
                    beforeEach(function() {
                        this.cardStatSpy.and.returnValue(1);
                    });

                    it('should return true', function() {
                        expect(this.prompt.checkCardCondition(this.card)).toBe(true);
                    });
                });

                describe('and the card will put it past the max', function() {
                    beforeEach(function() {
                        this.cardStatSpy.and.returnValue(2);
                    });

                    it('should return false', function() {
                        expect(this.prompt.checkCardCondition(this.card)).toBe(false);
                    });
                });
            });

            describe('when the card is already selected and is therefore being unselected', function() {
                beforeEach(function() {
                    this.prompt.selectedCards = [this.card];
                });

                describe('and the card will not put it past the max', function() {
                    beforeEach(function() {
                        this.cardStatSpy.and.returnValue(1);
                    });

                    it('should return true', function() {
                        expect(this.prompt.checkCardCondition(this.card)).toBe(true);
                    });
                });

                describe('and the card will put it past the max', function() {
                    beforeEach(function() {
                        this.cardStatSpy.and.returnValue(2);
                    });

                    it('should return true', function() {
                        expect(this.prompt.checkCardCondition(this.card)).toBe(true);
                    });
                });
            });
        });
    });
});
