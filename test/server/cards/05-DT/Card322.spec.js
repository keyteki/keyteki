describe('Card 322', function () {
    describe("Card 322's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['card-322', 'sleep-with-the-fishes', 'horrid-synan'],
                    inPlay: ['keyfrog', 'professor-terato']
                },
                player2: {
                    inPlay: ['troll', 'pile-of-skulls']
                }
            });
        });

        it('should exhaust a creature for each card played', function () {
            this.player1.play(this.card322);

            this.player1.play(this.sleepWithTheFishes);
            //This prompt doesn't appear because sleep with the fishes is has no targets at this point and isn't considered a valid trigger to choose.
            //this.player1.clickPrompt('??');
            expect(this.player1).not.toBeAbleToSelect(this.horridSynan);
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.professorTerato);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');

            this.player1.play(this.horridSynan);
            expect(this.player1).toHavePrompt('??');
            expect(this.player1).toBeAbleToSelect(this.horridSynan);
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.professorTerato);
            expect(this.player1).not.toBeAbleToSelect(this.pileOfSkulls);
            this.player1.clickCard(this.professorTerato);
            expect(this.professorTerato.exhausted).toBe(true);
        });

        xit('can exhaust after playing an action', function () {
            this.player1.play(this.card322);

            this.player1.play(this.sleepWithTheFishes);
            //this.player1.clickPrompt('Sleep with the Fishes');
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
