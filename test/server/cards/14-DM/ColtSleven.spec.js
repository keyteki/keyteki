describe('Colt Sleven', function () {
    describe("Colt Sleven's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['colt-sleven'],
                    inPlay: ['urchin']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('deals 1 damage to a creature for each +1 power counter on each creature', function () {
            this.urchin.powerCounters = 2;
            this.troll.powerCounters = 1;
            this.player1.play(this.coltSleven);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.coltSleven);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when no power counters exist', function () {
            this.player1.play(this.coltSleven);
            expect(this.player1).isReadyToTakeAction();
        });

        it('forces self-damage when no enemy creatures are in play', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player2.moveCard(this.krump, 'discard');
            this.urchin.powerCounters = 2;
            this.player1.play(this.coltSleven);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.coltSleven);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can distribute damage across different creatures', function () {
            this.urchin.powerCounters = 3;
            this.player1.play(this.coltSleven);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.urchin);
            expect(this.troll.damage).toBe(1);
            expect(this.krump.damage).toBe(1);
            expect(this.urchin.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
