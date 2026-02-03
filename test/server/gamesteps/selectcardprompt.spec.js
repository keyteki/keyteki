const _ = require('underscore');
const SelectCardPrompt = require('../../../server/game/gamesteps/selectcardprompt.js');

function createSpyObj(name, methods) {
    const obj = { _name: name };
    for (const method of methods) {
        obj[method] = vi.fn();
    }
    return obj;
}

describe.skip('the SelectCardPrompt', function () {
    function createCardSpy(properties = {}) {
        let card = createSpyObj('card', ['allowGameAction', 'getType']);
        card.getType.mockReturnValue('character');
        card.allowGameAction.mockReturnValue(true);
        _.extend(card, properties);
        return card;
    }

    beforeEach(function () {
        this.game = createSpyObj('game', ['getPlayers', 'getCurrentAbilityContext']);
        this.game.getCurrentAbilityContext.mockReturnValue({
            source: 'framework',
            card: null,
            stage: 'framework'
        });

        this.player = createSpyObj('player1', [
            'setPrompt',
            'cancelPrompt',
            'clearSelectableCards',
            'clearSelectedCards',
            'setSelectableCards',
            'setSelectedCards',
            'clearSelectableRings',
            'startClock',
            'stopClock'
        ]);
        this.player.cardsInPlay = [];
        this.otherPlayer = createSpyObj('player2', [
            'setPrompt',
            'cancelPrompt',
            'clearSelectableCards',
            'clearSelectedCards',
            'setSelectableCards',
            'setSelectedCards',
            'startClock',
            'stopClock'
        ]);
        this.card = createCardSpy({ controller: this.player });

        this.player.cardsInPlay.push(this.card);

        this.previousCard = createCardSpy({ selected: true, controller: this.player });
        this.player.selectedCards = [this.previousCard];

        this.properties = {
            location: 'any',
            cardCondition: function () {
                return true;
            },
            onSelect: function () {
                return true;
            },
            onMenuCommand: function () {
                return true;
            },
            onCancel: function () {
                return true;
            }
        };
        this.properties.cardCondition = vi.fn();
        this.properties.onSelect = vi.fn();
        this.properties.onMenuCommand = vi.fn();
        this.properties.onCancel = vi.fn();
    });

    describe('for a single card prompt', function () {
        beforeEach(function () {
            this.properties.numCards = 1;
            this.prompt = new SelectCardPrompt(this.game, this.player, this.properties);
        });

        it('should unselect the cards when the prompt starts', function () {
            expect(this.player.clearSelectedCards).toHaveBeenCalled();
        });

        describe('the onCardClicked() function', function () {
            describe('when the player is not the prompted player', function () {
                it('should return false', function () {
                    expect(this.prompt.onCardClicked(this.otherPlayer, this.card)).toBe(false);
                });
            });

            describe('when the card does not match the allowed condition', function () {
                beforeEach(function () {
                    this.properties.cardCondition.mockReturnValue(false);
                });

                it('should return false', function () {
                    expect(this.prompt.onCardClicked(this.player, this.card)).toBe(false);
                });
            });

            describe('when the specified game action is not allowed for the target', function () {
                beforeEach(function () {
                    this.card.allowGameAction.mockReturnValue(false);
                });

                it('should return false', function () {
                    expect(this.prompt.onCardClicked(this.player, this.card)).toBe(false);
                });
            });

            describe('when the card is not of the correct type', function () {
                beforeEach(function () {
                    this.properties.cardCondition.mockReturnValue(true);
                    this.card.getType.mockReturnValue('character');
                    this.prompt.properties.cardType = ['event'];
                    this.prompt = new SelectCardPrompt(this.game, this.player, this.properties);
                });

                it('should return false', function () {
                    expect(this.prompt.onCardClicked(this.player, this.card)).toBe(false);
                });
            });

            describe('when the card does match the condition', function () {
                beforeEach(function () {
                    this.properties.cardCondition.mockReturnValue(true);
                });

                it('should call the onSelect event', function () {
                    this.prompt.onCardClicked(this.player, this.card);
                    expect(this.properties.onSelect).toHaveBeenCalledWith(this.player, this.card);
                });

                describe('when onSelect returns true', function () {
                    beforeEach(function () {
                        this.properties.onSelect.mockReturnValue(true);
                    });

                    it('should complete the prompt', function () {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.prompt.isComplete()).toBe(true);
                    });

                    it('should reselect the card when the prompt is completed', function () {
                        this.prompt.onCardClicked(this.player, this.card);
                        this.prompt.continue();

                        expect(this.player.setSelectedCards).toHaveBeenCalledWith([
                            this.previousCard
                        ]);
                    });
                });

                describe('when onSelect returns false', function () {
                    beforeEach(function () {
                        this.properties.onSelect.mockReturnValue(false);
                    });

                    it('should not complete the prompt', function () {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.prompt.isComplete()).toBe(false);
                    });
                });
            });
        });

        describe('the onMenuCommand() function', function () {
            describe('when the player is not the prompted player', function () {
                it('should return false', function () {
                    expect(this.prompt.onMenuCommand(this.otherPlayer)).toBe(false);
                });
            });

            describe('when the player is the prompted player', function () {
                describe('when the cancel button is clicked', function () {
                    it('should call the onCancel event', function () {
                        this.prompt.onMenuCommand(this.player, 'cancel', this.prompt.uuid);
                        expect(this.properties.onCancel).toHaveBeenCalled();
                    });

                    it('should complete the prompt', function () {
                        this.prompt.onMenuCommand(this.player, 'cancel', this.prompt.uuid);
                        expect(this.prompt.isComplete()).toBe(true);
                    });
                });

                describe('when an additional button is clicked', function () {
                    it('should not call onSelect', function () {
                        this.prompt.onMenuCommand(this.player, 'another', this.prompt.uuid);
                        expect(this.properties.onSelect).not.toHaveBeenCalled();
                    });

                    it('should not call the onCancel event', function () {
                        this.prompt.onMenuCommand(this.player, 'another', this.prompt.uuid);
                        expect(this.properties.onCancel).not.toHaveBeenCalled();
                    });

                    it('should call the onMenuCommand event', function () {
                        this.prompt.onMenuCommand(this.player, 'another', this.prompt.uuid);
                        expect(this.properties.onMenuCommand).toHaveBeenCalledWith(
                            this.player,
                            'another'
                        );
                    });

                    describe('when the menu handler returns false', function () {
                        beforeEach(function () {
                            this.properties.onMenuCommand.mockReturnValue(false);
                        });

                        it('should not complete the prompt', function () {
                            this.prompt.onMenuCommand(this.player, 'another', this.prompt.uuid);
                            expect(this.prompt.isComplete()).toBe(false);
                        });
                    });

                    describe('when the menu handler returns true', function () {
                        beforeEach(function () {
                            this.properties.onMenuCommand.mockReturnValue(true);
                        });

                        it('should complete the prompt', function () {
                            this.prompt.onMenuCommand(this.player, 'another', this.prompt.uuid);
                            expect(this.prompt.isComplete()).toBe(true);
                        });

                        it('should reselect the card when the prompt is completed', function () {
                            this.prompt.onMenuCommand(this.player, 'another', this.prompt.uuid);
                            this.prompt.continue();

                            expect(this.previousCard.selected).toBe(true);
                        });
                    });
                });
            });
        });
    });

    describe('for a multiple card prompt', function () {
        beforeEach(function () {
            this.card2 = createCardSpy();
            this.properties.numCards = 2;
            this.prompt = new SelectCardPrompt(this.game, this.player, this.properties);
        });

        describe('the onCardClicked() function', function () {
            describe('when the player is not the prompted player', function () {
                it('should return false', function () {
                    expect(this.prompt.onCardClicked(this.otherPlayer, this.card)).toBe(false);
                });
            });

            describe('when the card does not match the allowed condition', function () {
                beforeEach(function () {
                    this.properties.cardCondition.mockReturnValue(false);
                });

                it('should return false', function () {
                    expect(this.prompt.onCardClicked(this.player, this.card)).toBe(false);
                });
            });

            describe('when the card does match the condition', function () {
                beforeEach(function () {
                    this.properties.cardCondition.mockReturnValue(true);
                });

                describe('selecting a card owned by the prompted player', function () {
                    beforeEach(function () {
                        this.card.controller = this.player;
                    });

                    it('should select the card if it is not selected', function () {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.player.setSelectedCards).toHaveBeenCalledWith([this.card]);
                        expect(this.prompt.selectedCards).toContain(this.card);
                        expect(this.prompt.selectedCards.length).toBe(1);
                    });

                    it('should unselect the card if it is selected', function () {
                        this.prompt.selectedCards = [this.card];
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.player.setSelectedCards).toHaveBeenCalledWith([]);
                        expect(this.prompt.selectedCards).not.toContain(this.card);
                        expect(this.prompt.selectedCards.length).toBe(0);
                    });

                    it('should not call onSelect', function () {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.properties.onSelect).not.toHaveBeenCalled();
                    });
                });

                describe('selecting a card owned by another player', function () {
                    beforeEach(function () {
                        this.card.controller = this.otherPlayer;
                    });

                    it('should select the card if it is not selected', function () {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.player.setSelectedCards).toHaveBeenCalledWith([this.card]);
                        expect(this.prompt.selectedCards).toContain(this.card);
                        expect(this.prompt.selectedCards.length).toBe(1);
                    });

                    it('should unselect the card if it is selected', function () {
                        this.prompt.onCardClicked(this.player, this.card);
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.player.setSelectedCards).toHaveBeenCalledWith([]);
                        expect(this.prompt.selectedCards).not.toContain(this.card);
                        expect(this.prompt.selectedCards.length).toBe(0);
                    });

                    it('should not call onSelect', function () {
                        this.prompt.onCardClicked(this.player, this.card);
                        expect(this.properties.onSelect).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when selecting unlimited cards', function () {
                beforeEach(function () {
                    this.properties.numCards = 0;
                    this.properties.cardCondition.mockReturnValue(true);
                    this.prompt = new SelectCardPrompt(this.game, this.player, this.properties);
                    this.prompt.onCardClicked(this.player, this.card);
                    this.prompt.onCardClicked(this.player, this.card2);
                    this.card3 = createCardSpy({ controller: this.player });
                });

                it('should select the card', function () {
                    this.prompt.onCardClicked(this.player, this.card3);
                    expect(this.player.setSelectedCards).toHaveBeenCalledWith([
                        this.card,
                        this.card2,
                        this.card3
                    ]);
                });
            });

            describe('when selecting more cards than the numCards property', function () {
                beforeEach(function () {
                    this.properties.cardCondition.mockReturnValue(true);
                    this.prompt.onCardClicked(this.player, this.card);
                    this.prompt.onCardClicked(this.player, this.card2);
                    this.card3 = createCardSpy();
                });

                it('should not select the card', function () {
                    this.prompt.onCardClicked(this.player, this.card3);
                    expect(this.card3.selected).toBeFalsy();
                });

                it('should return false', function () {
                    expect(this.prompt.onCardClicked(this.player, this.card3)).toBe(false);
                });
            });
        });

        describe('the onMenuCommand() function', function () {
            describe('when the player is not the prompted player', function () {
                it('should return false', function () {
                    expect(
                        this.prompt.onMenuCommand(this.otherPlayer, 'cancel', this.prompt.uuid)
                    ).toBe(false);
                });
            });

            describe('when no cards have been selected', function () {
                it('should not call onSelect', function () {
                    this.prompt.onMenuCommand(this.player, 'cancel', this.prompt.uuid);
                    expect(this.properties.onSelect).not.toHaveBeenCalled();
                });

                it('should call the onCancel event', function () {
                    this.prompt.onMenuCommand(this.player, 'cancel', this.prompt.uuid);
                    expect(this.properties.onCancel).toHaveBeenCalled();
                });

                it('should complete the prompt', function () {
                    this.prompt.onMenuCommand(this.player, 'cancel', this.prompt.uuid);
                    expect(this.prompt.isComplete()).toBe(true);
                });
            });

            describe('when cards have been selected', function () {
                beforeEach(function () {
                    this.properties.cardCondition.mockReturnValue(true);
                    this.prompt.onCardClicked(this.player, this.card);
                    this.prompt.onCardClicked(this.player, this.card2);
                });

                it('should not call the onCancel event', function () {
                    this.prompt.onMenuCommand(this.player, 'done', this.prompt.uuid);
                    expect(this.properties.onCancel).not.toHaveBeenCalled();
                });

                it('should call the onSelect event with an array of cards', function () {
                    this.prompt.onMenuCommand(this.player, 'done', this.prompt.uuid);
                    expect(this.properties.onSelect).toHaveBeenCalledWith(this.player, [
                        this.card,
                        this.card2
                    ]);
                });

                describe('when onSelect returns true', function () {
                    beforeEach(function () {
                        this.properties.onSelect.mockReturnValue(true);
                    });

                    it('should complete the prompt', function () {
                        this.prompt.onMenuCommand(this.player, 'done', this.prompt.uuid);
                        expect(this.prompt.isComplete()).toBe(true);
                    });

                    it('should clear selection of the cards', function () {
                        this.prompt.onMenuCommand(this.player, 'done', this.prompt.uuid);
                        expect(this.player.clearSelectedCards).toHaveBeenCalled();
                    });
                });

                describe('when onSelect returns false', function () {
                    beforeEach(function () {
                        this.properties.onSelect.mockReturnValue(false);
                        this.prompt.onMenuCommand(this.player, 'done', this.prompt.uuid);
                    });

                    it('should not complete the prompt', function () {
                        expect(this.prompt.isComplete()).toBe(false);
                    });

                    it('should clear selections', function () {
                        expect(this.player.clearSelectedCards).toHaveBeenCalled();
                    });

                    it('should remove select cards on the prompt', function () {
                        expect(this.prompt.selectedCards.length).toBe(0);
                    });
                });
            });

            describe('when cards have been selected and unselected', function () {
                beforeEach(function () {
                    this.properties.cardCondition.mockReturnValue(true);
                    this.prompt.onCardClicked(this.player, this.card);
                    this.prompt.onCardClicked(this.player, this.card2);
                    this.prompt.onCardClicked(this.player, this.card);
                });

                it('should call the onSelect event with only the cards still selected', function () {
                    this.prompt.onMenuCommand(this.player, 'done', this.prompt.uuid);
                    expect(this.properties.onSelect).toHaveBeenCalledWith(this.player, [
                        this.card2
                    ]);
                });
            });
        });
    });

    describe('for stat-based prompts', function () {
        beforeEach(function () {
            this.maxStatSpy = vi.fn();
            this.maxStatSpy.mockReturnValue(1);
            this.cardStatSpy = vi.fn();
            this.properties.maxStat = this.maxStatSpy;
            this.properties.cardStat = this.cardStatSpy;
            this.prompt = new SelectCardPrompt(this.game, this.player, this.properties);
        });

        describe('checkCardCondition()', function () {
            beforeEach(function () {
                this.properties.cardCondition.mockReturnValue(true);
                this.card.getType.mockReturnValue('character');
            });

            describe('when the card is not selected', function () {
                beforeEach(function () {
                    this.prompt.selectedCards = [];
                });

                describe('and the card will not put it past the max', function () {
                    beforeEach(function () {
                        this.cardStatSpy.mockReturnValue(1);
                    });

                    it('should return true', function () {
                        expect(this.prompt.checkCardCondition(this.card)).toBe(true);
                    });
                });

                describe('and the card will put it past the max', function () {
                    beforeEach(function () {
                        this.cardStatSpy.mockReturnValue(2);
                    });

                    it('should return false', function () {
                        expect(this.prompt.checkCardCondition(this.card)).toBe(false);
                    });
                });
            });

            describe('when the card is already selected and is therefore being unselected', function () {
                beforeEach(function () {
                    this.prompt.selectedCards = [this.card];
                });

                describe('and the card will not put it past the max', function () {
                    beforeEach(function () {
                        this.cardStatSpy.mockReturnValue(1);
                    });

                    it('should return true', function () {
                        expect(this.prompt.checkCardCondition(this.card)).toBe(true);
                    });
                });

                describe('and the card will put it past the max', function () {
                    beforeEach(function () {
                        this.cardStatSpy.mockReturnValue(2);
                    });

                    it('should return true', function () {
                        expect(this.prompt.checkCardCondition(this.card)).toBe(true);
                    });
                });
            });
        });
    });
});
