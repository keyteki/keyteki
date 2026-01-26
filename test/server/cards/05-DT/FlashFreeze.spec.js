describe('Flash Freeze', function () {
    describe("Flash Freeze's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['flash-freeze', 'sleep-with-the-fishes', 'horrid-synan'],
                    inPlay: ['keyfrog', 'professor-terato']
                },
                player2: {
                    inPlay: ['troll', 'pile-of-skulls']
                }
            });
        });

        it('should exhaust a creature for each card played', function () {
            this.player1.play(this.flashFreeze);

            this.player1.play(this.sleepWithTheFishes);
            this.player1.clickPrompt('Flash Freeze');
            expect(this.player1).not.toBeAbleToSelect(this.horridSynan);
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.professorTerato);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');

            this.player1.play(this.horridSynan);
            expect(this.player1).toHavePrompt('Flash Freeze');
            expect(this.player1).toBeAbleToSelect(this.horridSynan);
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.professorTerato);
            expect(this.player1).not.toBeAbleToSelect(this.pileOfSkulls);
            this.player1.clickCard(this.professorTerato);
            expect(this.professorTerato.exhausted).toBe(true);
        });

        it('can choose the order of resolving Flash Freeze and other actions', function () {
            this.player1.play(this.flashFreeze);

            this.player1.play(this.sleepWithTheFishes);
            this.player1.clickPrompt('Sleep with the Fishes');
            expect(this.player1).not.toBeAbleToSelect(this.horridSynan);
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.professorTerato);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.exhausted).toBe(true);
        });
    });
});
