describe('Tidal Trouble', function () {
    describe("Tidal Trouble's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['tidal-trouble'],
                    inPlay: ['troll', 'legendary-keyraken']
                },
                player2: {
                    inPlay: ['krump', 'bumpsy', 'batdrone', 'ember-imp']
                }
            });
        });

        it('stuns target creature and all creatures sharing a house with it', function () {
            this.player1.play(this.tidalTrouble);
            expect(this.player1).toHavePrompt('Tidal Trouble');
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.legendaryKeyraken);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.krump);
            expect(this.troll.stunned).toBe(true);
            expect(this.legendaryKeyraken.stunned).toBe(false);
            expect(this.krump.stunned).toBe(true);
            expect(this.bumpsy.stunned).toBe(true);
            expect(this.batdrone.stunned).toBe(false);
            expect(this.emberImp.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
