describe('Jayne the Bard', function () {
    describe("Jayne the Bard's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    inPlay: ['jayne-the-bard', 'raiding-knight', 'almsmaster']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'flaxia', 'dew-faerie']
                }
            });
        });

        it('should deal 2 damage to an enemy creature and repeat if it has amber', function () {
            this.krump.amber = 1;
            this.player1.reap(this.jayneTheBard);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.jayneTheBard);
            expect(this.player1).not.toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).not.toBeAbleToSelect(this.almsmaster);
            this.player1.clickCard(this.krump);
            expect(this.krump.damage).toBe(2);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.jayneTheBard);
            expect(this.player1).not.toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).not.toBeAbleToSelect(this.almsmaster);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not repeat if the target has no amber', function () {
            this.dewFaerie.amber = 1;
            this.player1.reap(this.jayneTheBard);
            this.player1.clickCard(this.dewFaerie);
            expect(this.dewFaerie.location).toBe('discard');
            this.player1.clickCard(this.krump);
            expect(this.krump.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should repeat if the target has amber but is destroyed', function () {
            this.player1.reap(this.jayneTheBard);
            this.player1.clickCard(this.krump);
            expect(this.krump.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should exalt 2 friendly creatures when scrapped', function () {
            this.player1.moveCard(this.jayneTheBard, 'hand');
            this.player1.scrap(this.jayneTheBard);
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.almsmaster);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.raidingKnight);
            this.player1.clickCard(this.almsmaster);
            this.player1.clickPrompt('Done');
            expect(this.raidingKnight.amber).toBe(1);
            expect(this.almsmaster.amber).toBe(1);
            expect(this.jayneTheBard.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
