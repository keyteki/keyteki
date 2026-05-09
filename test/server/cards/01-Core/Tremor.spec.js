describe('Tremor', function () {
    describe("Tremor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['tremor'],
                    inPlay: ['batdrone', 'mother', 'daughter', 'dextre']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy', 'headhunter']
                }
            });
        });

        it('should stun target creature and its neighbors', function () {
            this.player1.play(this.tremor);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.daughter);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.headhunter);
            this.player1.clickCard(this.krump);
            expect(this.batdrone.stunned).toBe(false);
            expect(this.mother.stunned).toBe(false);
            expect(this.daughter.stunned).toBe(false);
            expect(this.dextre.stunned).toBe(false);
            expect(this.troll.stunned).toBe(true);
            expect(this.krump.stunned).toBe(true);
            expect(this.bumpsy.stunned).toBe(true);
            expect(this.headhunter.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should stun target on end of battleline with one neighbor', function () {
            this.player1.play(this.tremor);
            this.player1.clickCard(this.headhunter);
            expect(this.bumpsy.stunned).toBe(true);
            expect(this.headhunter.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
