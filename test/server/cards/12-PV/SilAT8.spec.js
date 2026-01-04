describe('Sil-A-T8', function () {
    describe("Sil-A-T8's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['sil-a-t8', 'away-team', 'cpo-zytar'],
                    inPlay: ['ember-imp', 'krump']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });

            this.emberImp.exhausted = true;
            this.krump.exhausted = true;
            this.urchin.exhausted = true;
        });

        it('should ready 0 creatures when it has no Star Alliance neighbors', function () {
            this.player1.playCreature(this.silAT8);
            this.silAT8.exhausted = false;
            this.player1.reap(this.silAT8);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should ready 1 creature when it has 1 Star Alliance neighbor', function () {
            this.player1.playCreature(this.silAT8);
            this.player1.playCreature(this.awayTeam);
            this.silAT8.exhausted = false;
            this.player1.reap(this.silAT8);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.awayTeam);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should ready 2 creatures when it has 2 Star Alliance neighbors', function () {
            this.player1.playCreature(this.cpoZytar);
            this.player1.playCreature(this.silAT8);
            this.player1.playCreature(this.awayTeam);
            this.silAT8.exhausted = false;
            this.player1.reap(this.silAT8);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.krump);
            expect(this.emberImp.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work after fighting', function () {
            this.player1.playCreature(this.silAT8);
            this.player1.playCreature(this.awayTeam);
            this.silAT8.exhausted = false;
            this.player1.fightWith(this.silAT8, this.urchin);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
