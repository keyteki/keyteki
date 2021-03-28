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
