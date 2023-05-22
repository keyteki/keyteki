describe('Conductor Jărroyă', function () {
    describe("Conductor Jărroyă's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'ekwidon',
                    inPlay: ['conductor-jarroya', 'toad', 'shigziso-buggy', 'gauntlet-of-command']
                },
                player2: {
                    inPlay: ['shisnyasi-buggy']
                }
            });
        });

        it('it should ready friendly buggy artifacts', function () {
            this.player1.useAction(this.shigzisoBuggy);
            this.player1.clickCard(this.toad);
            expect(this.player1.amber).toBe(6);
            this.gauntletOfCommand.exhausted = true;
            this.shisnyasiBuggy.exhausted = true;
            expect(this.shigzisoBuggy.exhausted).toBe(true);
            this.player1.reap(this.conductorJarroya);
            expect(this.shigzisoBuggy.exhausted).toBe(false);
            expect(this.gauntletOfCommand.exhausted).toBe(true);
            expect(this.shisnyasiBuggy.exhausted).toBe(true);
        });
    });
});
