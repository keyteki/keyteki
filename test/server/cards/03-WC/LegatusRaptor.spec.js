describe('Legatus Raptor', function () {
    describe("Legatus Raptor's Fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['legatus-raptor', 'crassosaurus']
                },
                player2: {
                    inPlay: ['nexus', 'dodger']
                }
            });
        });

        it('exalts Legatus Raptor and readies and uses another friendly creature', function () {
            this.crassosaurus.exhaust();
            this.player1.fightWith(this.legatusRaptor, this.nexus);
            this.player1.clickCard(this.legatusRaptor);
            expect(this.legatusRaptor.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.crassosaurus);
            expect(this.player1).not.toBeAbleToSelect(this.legatusRaptor);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.crassosaurus);
            expect(this.crassosaurus.exhausted).toBe(false);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.crassosaurus.exhausted).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can decline the optional exalt and skip the follow-up', function () {
            this.player1.fightWith(this.legatusRaptor, this.nexus);
            this.player1.clickPrompt('Done');
            expect(this.legatusRaptor.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
