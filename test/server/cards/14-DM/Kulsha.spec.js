describe('Kulsha', function () {
    describe("Kulsha's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['kulsha', 'kulsha2']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'urchin']
                }
            });
        });

        it('opp keys cost +2 per their forged keys', function () {
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player2.player.keys.red = true;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player2.player.getCurrentKeyCost()).toBe(8);
            this.player2.player.keys.blue = true;
            this.player2.endTurn();
            this.player1.clickPrompt('ouboros');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player2.player.getCurrentKeyCost()).toBe(10);
            expect(this.player2).isReadyToTakeAction();
        });

        it('exhausts up to 3 creatures on fight', function () {
            this.player1.fightWith(this.kulsha, this.troll);
            expect(this.player1).toHavePrompt('Choose 3 creatures');
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Done');
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.urchin.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
