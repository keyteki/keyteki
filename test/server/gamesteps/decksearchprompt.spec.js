const _ = require('underscore');
const DeckSearchPrompt = require('../../../server/game/gamesteps/decksearchprompt.js');

xdescribe('DeckSearchPrompt', function() {
    function createCardSpy(properties = {}) {
        let card = jasmine.createSpyObj('card', ['getSummary', 'getType']);
        _.extend(card, properties);
        return card;
    }

    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['addMessage', 'getPlayers']);

        this.player = jasmine.createSpyObj('player1', ['cancelPrompt', 'setPrompt', 'findCardByUuid', 'searchConflictDeck', 'shuffleConflictDeck']);
        this.player.conflictDeck = _([]);
        this.otherPlayer = jasmine.createSpyObj('player2', ['setPrompt', 'cancelPrompt']);

        this.properties = {
            cardCondition: jasmine.createSpy('cardCondition'),
            onSelect: jasmine.createSpy('onSelect'),
            onCancel: jasmine.createSpy('onCancel')
        };
        this.properties.cardCondition.and.returnValue(true);
    });

    describe('constructor', function() {
        describe('cardType', function() {
            it('should default to a list of draw card types', function() {
                let prompt = new DeckSearchPrompt(this.game, this.player, this.properties);
                expect(prompt.properties.cardType).toEqual(['attachment', 'character', 'event']);
            });

            it('should let a custom array be set', function() {
                this.properties.cardType = ['foo'];
                let prompt = new DeckSearchPrompt(this.game, this.player, this.properties);
                expect(prompt.properties.cardType).toEqual(['foo']);
            });

            it('should let a non-array be set', function() {
                this.properties.cardType = 'foo';
                let prompt = new DeckSearchPrompt(this.game, this.player, this.properties);
                expect(prompt.properties.cardType).toEqual(['foo']);
            });
        });
    });

    describe('for a finite search', function() {
        beforeEach(function() {
            this.properties.numCards = 10;
            this.prompt = new DeckSearchPrompt(this.game, this.player, this.properties);
        });

        describe('activePrompt()', function() {
            beforeEach(function() {
                this.player.searchConflictDeck.and.returnValue([
                    createCardSpy({ uuid: '1111', name: 'Foo' }),
                    createCardSpy({ uuid: '2222', name: 'Bar' }),
                    createCardSpy({ uuid: '3333', name: 'Foo' })
                ]);
                this.result = this.prompt.activePrompt();
            });

            it('should search the deck with appropriate parameters', function() {
                expect(this.player.searchConflictDeck).toHaveBeenCalledWith(10, jasmine.any(Function));
            });

            it('should generate buttons for each unique card by title', function() {
                expect(this.result.buttons).toContain(jasmine.objectContaining({ text: 'Foo', arg: '1111' }));
                expect(this.result.buttons).toContain(jasmine.objectContaining({ text: 'Bar', arg: '2222' }));
                expect(this.result.buttons).not.toContain(jasmine.objectContaining({ arg: '3333' }));
            });

            it('should include a Done button', function() {
                expect(this.result.buttons).toContain(jasmine.objectContaining({ text: 'Done', arg: 'done' }));
            });
        });

        describe('onMenuCommand()', function() {
            beforeEach(function() {
                this.card = { uuid: '1111' };
                this.player.findCardByUuid.and.returnValue(this.card);
            });

            describe('when receiving input from the opponent', function() {
                beforeEach(function() {
                    this.result = this.prompt.onMenuCommand(this.otherPlayer, '1111');
                });

                it('should return false', function() {
                    expect(this.result).toBe(false);
                });

                it('should not complete the prompt', function() {
                    expect(this.prompt.isComplete()).toBe(false);
                });

                it('should not call any of the callbacks', function() {
                    expect(this.properties.onSelect).not.toHaveBeenCalled();
                    expect(this.properties.onCancel).not.toHaveBeenCalled();
                });

                it('should not shuffle the deck', function() {
                    expect(this.player.shuffleConflictDeck).not.toHaveBeenCalled();
                });
            });

            describe('when clicking Done', function() {
                beforeEach(function() {
                    this.prompt.onMenuCommand(this.player, 'done');
                });

                it('should complete the prompt', function() {
                    expect(this.prompt.isComplete()).toBe(true);
                });

                it('should call the onCancel callback', function() {
                    expect(this.properties.onCancel).toHaveBeenCalled();
                });

                it('should shuffle the deck', function() {
                    expect(this.player.shuffleConflictDeck).toHaveBeenCalled();
                });
            });

            describe('when choosing a card not in the deck', function() {
                beforeEach(function() {
                    this.player.findCardByUuid.and.returnValue(undefined);
                    this.result = this.prompt.onMenuCommand(this.player, '2222');
                });

                it('should return false', function() {
                    expect(this.result).toBe(false);
                });

                it('should not complete the prompt', function() {
                    expect(this.prompt.isComplete()).toBe(false);
                });

                it('should not call any of the callbacks', function() {
                    expect(this.properties.onSelect).not.toHaveBeenCalled();
                    expect(this.properties.onCancel).not.toHaveBeenCalled();
                });

                it('should not shuffle the deck', function() {
                    expect(this.player.shuffleConflictDeck).not.toHaveBeenCalled();
                });
            });

            describe('when choosing a card', function() {
                beforeEach(function() {
                    this.prompt.onMenuCommand(this.player, '1111');
                });

                it('should complete the prompt', function() {
                    expect(this.prompt.isComplete()).toBe(true);
                });

                it('should call the onSelect callback', function() {
                    expect(this.properties.onSelect).toHaveBeenCalledWith(this.player, this.card);
                });

                it('should shuffle the deck', function() {
                    expect(this.player.shuffleConflictDeck).toHaveBeenCalled();
                });
            });
        });
    });

    describe('for a full deck search', function() {
        beforeEach(function() {
            delete this.properties.numCards;
            this.prompt = new DeckSearchPrompt(this.game, this.player, this.properties);
        });

        describe('activePrompt()', function() {
            beforeEach(function() {
                this.player.searchConflictDeck.and.returnValue([
                    createCardSpy({ uuid: '1111', name: 'Foo' }),
                    createCardSpy({ uuid: '2222', name: 'Bar' }),
                    createCardSpy({ uuid: '3333', name: 'Foo' })
                ]);
                this.result = this.prompt.activePrompt();
            });

            it('should search the deck with appropriate parameters', function() {
                expect(this.player.searchConflictDeck).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it('should generate buttons for each unique card by title', function() {
                expect(this.result.buttons).toContain(jasmine.objectContaining({ text: 'Foo', arg: '1111' }));
                expect(this.result.buttons).toContain(jasmine.objectContaining({ text: 'Bar', arg: '2222' }));
                expect(this.result.buttons).not.toContain(jasmine.objectContaining({ arg: '3333' }));
            });

            it('should include a Done button', function() {
                expect(this.result.buttons).toContain(jasmine.objectContaining({ text: 'Done', arg: 'done' }));
            });
        });
    });
});
