describe('Sedimentary Nap', function () {
    describe("Sedimentary Nap's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['urchin', 'hunting-witch'],
                    hand: ['sedimentary-nap'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'culf-the-quiet', 'shock-herder']
                }
            });
        });

        it("should shuffle a creature into its owner's deck", function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.play(this.sedimentaryNap);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.culfTheQuiet);
            expect(this.player1).toBeAbleToSelect(this.shockHerder);
            this.player1.clickCard(this.urchin);
            expect(shuffled).toBe(this.player1.player);
            expect(this.urchin.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });

        it("should shuffle the most powerful friendly creature into its owner's deck when fate is triggered", function () {
            this.player1.activateProphecy(this.overreach, this.sedimentaryNap);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            let shuffled = null;
            this.player2.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player2.reap(this.krump);
            expect(this.player2).toBeAbleToSelect(this.culfTheQuiet);
            expect(this.player2).toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.shockHerder);
            this.player2.clickCard(this.culfTheQuiet);
            expect(this.culfTheQuiet.location).toBe('deck');
            expect(this.krump.location).toBe('play area');
            expect(shuffled).toBe(this.player2.player);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
