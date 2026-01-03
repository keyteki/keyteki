describe('Seance Scanner', function () {
    describe("Seance Scanner's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['stealth-mode'],
                    inPlay: ['séance-scanner', 'medic-ingram', 'urchin', 'batdrone'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should do nothing when not haunted', function () {
            this.player1.useAction(this.séanceScanner);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow a non-SA use when haunted', function () {
            this.player1.play(this.stealthMode);
            this.player1.useAction(this.séanceScanner);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
