describe('Ambrosia Outpost', function () {
    describe("Ambrosia Outpost's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['æmbrosia-outpost', 'galeatops'],
                    hand: ['curse-of-vanity', 'paraguardian']
                },
                player2: {
                    amber: 4,
                    inPlay: []
                }
            });
        });

        it('should not prompt for any creature, since there is no friendly creature.', function () {
            this.player1.useAction(this.æmbrosiaOutpost);
            this.player1.clickCard(this.galeatops);
            this.expectReadyToTakeAction(this.player1);
            expect(this.player1.amber).toBe(1);
        });

        it('should not prompt for any creature, since friendly creature has no.', function () {
            this.player1.playCreature(this.paraguardian);
            this.player1.useAction(this.æmbrosiaOutpost);
            this.player1.clickCard(this.galeatops);
            this.expectReadyToTakeAction(this.player1);
            expect(this.player1.amber).toBe(1);
        });

        it('should take amber from creature', function () {
            this.player1.play(this.curseOfVanity);
            this.player1.clickCard(this.galeatops);
            this.player1.playCreature(this.paraguardian);
            this.player1.useAction(this.æmbrosiaOutpost);
            this.player1.clickCard(this.paraguardian);
            this.player1.clickCard(this.galeatops);
            expect(this.galeatops.tokens.amber).toBe(undefined);
            expect(this.player1.amber).toBe(3);
        });
    });
});
