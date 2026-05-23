const DeckBuilder = require('../helpers/deckbuilder.js');

describe('Chains effects', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'setup',
            player1: {
                hand: [
                    'zorg',
                    'batdrone',
                    'dextre',
                    'mother',
                    'punctuated-equilibrium',
                    'dust-pixie'
                ],
                chains: 1,
                discard: ['hunting-witch']
            },
            player2: {
                inPlay: []
            }
        });
        this.player1.clickPrompt('logos');
    });

    it('ensure player chains drop 1 and draw 1 with 1 chain, 4 cards in hand', function () {
        this.player1.moveCard(this.batdrone, 'discard');
        this.player1.moveCard(this.dextre, 'discard');
        expect(this.player1.hand.length).toBe(4);
        this.player1.endTurn();
        expect(this.player1.chains).toBe(0);
        expect(this.player1.hand.length).toBe(5);
    });

    it('ensure player chains drop 1 and draw 0 with 1 chain, 5 cards in hand', function () {
        this.player1.moveCard(this.batdrone, 'discard');
        expect(this.player1.hand.length).toBe(5);
        this.player1.endTurn();
        expect(this.player1.chains).toBe(0);
        expect(this.player1.hand.length).toBe(5);
    });

    it('ensure player chains drop 0 and draw 0 with 1 chain, 6 cards in hand', function () {
        expect(this.player1.hand.length).toBe(6);
        this.player1.endTurn();
        expect(this.player1.chains).toBe(1);
        expect(this.player1.hand.length).toBe(6);
    });

    it('ensure player chains drop by 1 and draw 0 with 1 chain, 6 cards in hand, and card effect increasing hand size (+1)', function () {
        this.player1.moveCard(this.huntingWitch, 'hand');
        this.player1.play(this.mother);
        expect(this.player1.hand.length).toBe(6);
        this.player1.endTurn();
        expect(this.player1.chains).toBe(0);
        expect(this.player1.hand.length).toBe(6);
    });

    it('ensure player chains drop by 1 and draw 1 with 1 chain, 5 cards in hand, and card effect increasing hand size (+1)', function () {
        this.player1.play(this.mother);
        expect(this.player1.hand.length).toBe(5);
        this.player1.endTurn();
        expect(this.player1.chains).toBe(0);
        expect(this.player1.hand.length).toBe(6);
    });

    it('ensure player chains drop 1 and draw 0 with 9 chains, 5 cards in hand', function () {
        this.player1.player.chains = 9;
        this.player1.moveCard(this.batdrone, 'discard');
        this.player1.endTurn();
        expect(this.player1.chains).toBe(8);
        expect(this.player1.hand.length).toBe(5);
    });

    it('ensure player chains drop  1 and draw 1 with 9 chains, 3 cards in hand', function () {
        this.player1.player.chains = 9;
        this.player1.moveCard(this.batdrone, 'discard');
        this.player1.moveCard(this.mother, 'discard');
        this.player1.moveCard(this.dextre, 'discard');
        expect(this.player1.hand.length).toBe(3);
        this.player1.endTurn();
        expect(this.player1.chains).toBe(8);
        expect(this.player1.hand.length).toBe(4);
    });

    it('ensure player chains drop by 1 and draw 1 with 9 chains, 4 cards in hand, and card effect increase hand size (+1)', function () {
        this.player1.player.chains = 9;
        this.player1.play(this.mother);
        this.player1.moveCard(this.dextre, 'discard');
        expect(this.player1.hand.length).toBe(4);
        this.player1.endTurn();
        expect(this.player1.chains).toBe(8);
        expect(this.player1.hand.length).toBe(5);
    });

    it('ensure player chains drop by 1 and draw 0 with 9 chains, 5 cards in hand, and card effect increase hand size (+1)', function () {
        this.player1.player.chains = 9;
        this.player1.play(this.mother);
        expect(this.player1.hand.length).toBe(5);
        this.player1.endTurn();
        expect(this.player1.chains).toBe(8);
        expect(this.player1.hand.length).toBe(5);
    });
});

describe('First player draw with chains', function () {
    it('should reduce the first player bonus draw when chains are high', function () {
        this.setupTest({
            phase: 'setup',
            player1: {
                hand: [
                    'zorg',
                    'batdrone',
                    'dextre',
                    'mother',
                    'punctuated-equilibrium',
                    'dust-pixie'
                ],
                setupChains: 37,
                deck: ['hunting-witch', 'dextre', 'mother']
            },
            player2: {
                inPlay: []
            }
        });
        // Chains shed once during the single first-player refill
        expect(this.player1.chains).toBe(36);
        this.player1.clickPrompt('logos');
        this.player1.moveCard(this.batdrone, 'discard');
        this.player1.moveCard(this.dextre, 'discard');
        this.player1.moveCard(this.mother, 'discard');
        this.player1.endTurn();
        expect(this.player1.chains).toBe(35);
        expect(this.player1.hand.length).toBe(3);
    });
});

describe('Chains with increased hand size', function () {
    it('should draw 1 card with +3 hand size and 43 chains', function () {
        this.setupTest({
            phase: 'setup',
            player1: {
                hand: [],
                inPlay: ['mother', 'mother', 'mother'],
                amber: 0,
                chains: 43
            },
            player2: {
                inPlay: []
            }
        });
        expect(this.player1.player.maxHandSize).toBe(9);
        this.player1.clickPrompt('logos');
        this.player1.endTurn();
        expect(this.player1.hand.length).toBe(1);
        expect(this.player1.chains).toBe(42);
    });
});

describe('First player starting hand size with low chains', function () {
    function selectDecks(context) {
        const deckBuilder = new DeckBuilder();
        context.player1.selectDeck(
            deckBuilder.customDeck({
                hand: ['troll', 'anger', 'punch', 'bumpsy', 'headhunter', 'smith', 'earthshaker']
            })
        );
        context.player2.selectDeck(
            deckBuilder.customDeck({
                hand: [
                    'dust-pixie',
                    'hunting-witch',
                    'flaxia',
                    'silvertooth',
                    'urchin',
                    'bad-penny'
                ]
            })
        );
    }

    it('should draw the extra starting card when no chains', function () {
        selectDecks(this);
        this.startGame();
        this.player1.clickPrompt('Keep Hand');
        this.player2.clickPrompt('Keep Hand');
        expect(this.player1.chains).toBe(0);
        expect(this.player1.hand.length).toBe(7);
        expect(this.player2.hand.length).toBe(6);
    });

    it('should reduce the first player starting hand by one with chains=1', function () {
        selectDecks(this);
        this.player1.player.chains = 1;
        this.startGame();
        this.player1.clickPrompt('Keep Hand');
        this.player2.clickPrompt('Keep Hand');
        expect(this.player1.chains).toBe(0);
        expect(this.player1.hand.length).toBe(6);
    });

    it('should reduce the first player starting hand when chains penalty exceeds the extra card', function () {
        selectDecks(this);
        this.player1.player.chains = 7;
        this.startGame();
        this.player1.clickPrompt('Keep Hand');
        this.player2.clickPrompt('Keep Hand');
        expect(this.player1.chains).toBe(6);
        expect(this.player1.hand.length).toBe(5);
    });
});
