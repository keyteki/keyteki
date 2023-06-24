describe('Conductor Jărroyă', function () {
    describe("Conductor Jărroyă's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'ekwidon',
                    inPlay: ['conductor-jărroyă', 'toad', 'shĭgzisŏ-buggy', 'gauntlet-of-command']
                },
                player2: {
                    inPlay: ['shĭsnyasĭ-buggy']
                }
            });
        });

        it('it should ready friendly buggy artifacts', function () {
            this.player1.useAction(this.shĭgzisŏBuggy);
            this.player1.clickCard(this.toad);
            expect(this.player1.amber).toBe(6);
            this.gauntletOfCommand.exhausted = true;
            this.shĭsnyasĭBuggy.exhausted = true;
            expect(this.shĭgzisŏBuggy.exhausted).toBe(true);
            this.player1.reap(this.conductorJărroyă);
            expect(this.shĭgzisŏBuggy.exhausted).toBe(false);
            expect(this.gauntletOfCommand.exhausted).toBe(true);
            expect(this.shĭsnyasĭBuggy.exhausted).toBe(true);
        });
    });
});
