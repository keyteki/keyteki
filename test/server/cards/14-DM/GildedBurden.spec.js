describe('Gilded Burden', function () {
    describe("Gilded Burden's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['gilded-burden']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'bumpsy', 'urchin']
                }
            });
        });

        it('captures 2 from own side per opp forged key', function () {
            this.player1.player.keys.red = true;
            this.player1.player.keys.blue = true;
            this.player2.player.keys.red = true;
            this.player2.player.keys.blue = true;
            this.player1.play(this.gildedBurden);
            expect(this.player1).toHavePrompt('Choose 2 creatures');
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Done');
            expect(this.troll.tokens.amber).toBe(2);
            expect(this.bumpsy.tokens.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when opp has 0 forged keys', function () {
            this.player1.play(this.gildedBurden);
            expect(this.troll.tokens.amber).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
