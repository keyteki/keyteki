describe('Offering to Invidius', function () {
    describe("Offering to Invidius's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['offering-to-invidius'],
                    discard: ['pitlord', 'hand-of-dis']
                },
                player2: {
                    discard: ['batdrone', 'troll']
                }
            });
        });

        it('should purge a creature from your discard pile when played', function () {
            this.player1.play(this.offeringToInvidius);
            expect(this.player1).toHavePrompt('Offering to Invidius');
            expect(this.player1).toBeAbleToSelect(this.pitlord);
            expect(this.player1).not.toBeAbleToSelect(this.handOfDis);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.pitlord);
            expect(this.pitlord.location).toBe('purged');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should purge a creature from opponent discard pile when played', function () {
            this.player1.play(this.offeringToInvidius);
            expect(this.player1).toHavePrompt('Offering to Invidius');
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('purged');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not be able to target non-creature cards', function () {
            this.player1.play(this.offeringToInvidius);
            expect(this.player1).toHavePrompt('Offering to Invidius');
            expect(this.player1).not.toBeAbleToSelect(this.handOfDis);
            expect(this.player1).toBeAbleToSelect(this.pitlord);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
        });

        it('should work when only opponent has creatures in discard', function () {
            this.player1.moveCard(this.pitlord, 'hand');
            this.player1.play(this.offeringToInvidius);
            expect(this.player1).toHavePrompt('Offering to Invidius');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('purged');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
