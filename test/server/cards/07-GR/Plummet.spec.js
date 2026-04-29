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
            this.player1.clickPrompt('Autoresolve');
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.shoppingSpree.location).toBe('discard');
            expect(this.pressGang.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 2 damage to all creatures', function () {
            this.player1.play(this.plummet);
            this.player1.clickPrompt('Autoresolve');
            expect(this.groke.damage).toBe(2);
            expect(this.cpoZytar.damage).toBe(1);
            expect(this.troll.damage).toBe(2);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 1 damage to all creatures', function () {
            this.player1.play(this.pressGang);
            this.player1.play(this.plummet);
            expect(this.groke.damage).toBe(1);
            expect(this.cpoZytar.damage).toBe(0);
            expect(this.troll.damage).toBe(1);
            expect(this.batdrone.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals no damage to all creatures', function () {
            this.player1.moveCard(this.shoppingSpree, 'discard');
            this.player1.play(this.pressGang);
            this.player1.play(this.plummet);
            expect(this.groke.damage).toBe(0);
            expect(this.cpoZytar.damage).toBe(0);
            expect(this.troll.damage).toBe(0);
            expect(this.batdrone.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
