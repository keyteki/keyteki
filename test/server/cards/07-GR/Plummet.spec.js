describe('Plummet', function () {
    describe("Plummet's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['plummet', 'shopping-spree', 'press-gang'],
                    inPlay: ['groke', 'cpo-zytar']
                },
                player2: {
                    inPlay: ['batdrone', 'troll']
                }
            });
        });

        it('discards hand', function () {
            this.player1.play(this.plummet);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.shoppingSpree.location).toBe('discard');
            expect(this.pressGang.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 2 damage to all creatures', function () {
            this.player1.play(this.plummet);
            expect(this.groke.tokens.damage).toBe(2);
            expect(this.cpoZytar.tokens.damage).toBe(1);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 1 damage to all creatures', function () {
            this.player1.play(this.pressGang);
            this.player1.play(this.plummet);
            expect(this.groke.tokens.damage).toBe(1);
            expect(this.cpoZytar.tokens.damage).toBe(undefined);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.batdrone.tokens.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals no damage to all creatures', function () {
            this.player1.moveCard(this.shoppingSpree, 'discard');
            this.player1.play(this.pressGang);
            this.player1.play(this.plummet);
            expect(this.groke.tokens.damage).toBe(undefined);
            expect(this.cpoZytar.tokens.damage).toBe(undefined);
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.batdrone.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
