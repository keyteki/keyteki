describe('Cirrus Mace', function () {
    describe("Cirrus Mace's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'brobnar',
                    inPlay: ['cirrus-mace', 'dew-faerie', 'troll', 'alaka']
                },
                player2: {
                    inPlay: ['umbra', 'nexus']
                }
            });
        });

        it('gives 2 +1 counters to a friendly creature and damages neighbors', function () {
            this.player1.useAction(this.cirrusMace);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            this.player1.clickCard(this.troll);
            expect(this.troll.power).toBe(10);
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.alaka.tokens.damage).toBe(2);
            expect(this.dewFaerie.location).toBe('discard');
            expect(this.nexus.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gives 2 +1 counters to an enemy creature and damages neighbors', function () {
            this.player1.useAction(this.cirrusMace);
            this.player1.clickCard(this.nexus);
            expect(this.nexus.power).toBe(5);
            expect(this.umbra.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not break with no creatures in play', function () {
            this.player1.moveCard(this.dewFaerie, 'discard');
            this.player1.moveCard(this.troll, 'discard');
            this.player1.moveCard(this.alaka, 'discard');
            this.player2.moveCard(this.umbra, 'discard');
            this.player2.moveCard(this.nexus, 'discard');
            this.player1.useAction(this.cirrusMace);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
