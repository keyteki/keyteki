describe('Cacophonous Riot', function () {
    describe("Cacophonous Riot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['cacophonous-riot'],
                    inPlay: ['groke', 'cpo-zytar', 'troll']
                },
                player2: {
                    inPlay: ['dust-pixie', 'dew-faerie', 'flaxia']
                }
            });
        });

        it('can ready and enrage friendly creatures', function () {
            this.player1.reap(this.groke);
            this.player1.reap(this.troll);
            this.player1.play(this.cacophonousRiot);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.cpoZytar);
            expect(this.groke.exhausted).toBe(false);
            expect(this.groke.enraged).toBe(true);
            expect(this.cpoZytar.exhausted).toBe(false);
            expect(this.cpoZytar.enraged).toBe(true);
            expect(this.troll.exhausted).toBe(false);
            expect(this.troll.enraged).toBe(true);
            expect(this.dustPixie.enraged).toBe(false);
            expect(this.dewFaerie.enraged).toBe(false);
            expect(this.flaxia.enraged).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('can ready and enrage enemy creatures', function () {
            this.player1.play(this.cacophonousRiot);
            this.player1.clickCard(this.dewFaerie);
            expect(this.dustPixie.enraged).toBe(true);
            expect(this.dewFaerie.enraged).toBe(true);
            expect(this.flaxia.enraged).toBe(true);
            expect(this.groke.enraged).toBe(false);
            expect(this.cpoZytar.enraged).toBe(false);
            expect(this.troll.enraged).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
