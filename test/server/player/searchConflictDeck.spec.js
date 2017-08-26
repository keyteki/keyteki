const _ = require('underscore');
const Player = require('../../../server/game/player.js');

describe('the Player', () => {
    var game = jasmine.createSpyObj('game', ['getOtherPlayer', 'playerDecked', 'raiseEvent']);

    var player = new Player('1', 'Player 1', true, game);
    var conflictDeck = _([
        { name: 'foo' },
        { name: 'bar' },
        { name: 'baz' },
        { name: 'ball' }
    ]);

    beforeEach(() => {
        player.deck = conflictDeck;
        player.initialise();

        player.conflictDeck = conflictDeck;
    });

    describe('the searchConflictDeck() function', () => {
        describe('when no limit is passed', () => {
            it('should search all cards in the deck', () => {
                var cards = player.searchConflictDeck(() => {
                    return true;
                });
                expect(cards.length).toBe(conflictDeck.size());
            });

            it('should filter the results using the predicate', () => {
                var cards = player.searchConflictDeck((card) => {
                    return card.name === 'bar';
                });

                expect(cards.length).toBe(1);
            });
        });

        describe('when a limit is passed but no predicate', () => {
            describe('when the limit is positive', () => {
                it('should return from the top of the deck', () => {
                    var cards = player.searchConflictDeck(2);

                    expect(cards.length).toBe(2);
                    expect(cards[0].name).toBe('foo');
                    expect(cards[1].name).toBe('bar');
                });
            });

            describe('when the limit is negative', () => {
                it('should return from the bottom of the deck', () => {
                    var cards = player.searchConflictDeck(-2);

                    expect(cards.length).toBe(2);
                    expect(cards[0].name).toBe('baz');
                    expect(cards[1].name).toBe('ball');
                });
            });
        });

        describe('when both a limit and a predicate are passed', () => {
            it('should limit and filter', () => {
                var cards = player.searchConflictDeck(3, (card) => {
                    return card.name[0] === 'b';
                });

                expect(cards.length).toBe(2);
                expect(cards[0].name).toBe('bar');
                expect(cards[1].name).toBe('baz');
            });
        });
    });
});
