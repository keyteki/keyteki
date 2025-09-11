describe('Crimson Dax', function () {
    describe("Crimson Dax's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['ironyx-rebel', 'crim-torchtooth'],
                    inPlay: ['crimson-dax', 'dr-xyloxxzlphrex', 'thunderdell']
                },
                player2: {
                    inPlay: ['brikk-nastee', 'myx-the-tallminded']
                }
            });
        });

        it('should prompt the player to reveal a card and purge the selected card', function () {
            this.player1.reap(this.crimsonDax);
            expect(this.player1).toBeAbleToSelect(this.crimTorchtooth);
            expect(this.player1).not.toBeAbleToSelect(this.ironyxRebel);
            this.player1.clickCard(this.crimTorchtooth);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Crimson Dax');
            expect(this.crimTorchtooth.location).toBe('purged');
            expect(this.player1).toBeAbleToSelect(this.drXyloxxzlphrex);
            expect(this.player1).toBeAbleToSelect(this.crimsonDax);
            expect(this.player1).toBeAbleToSelect(this.myxTheTallminded);
            expect(this.player1).not.toBeAbleToSelect(this.thunderdell);
            expect(this.player1).not.toBeAbleToSelect(this.brikkNastee);
            this.player1.clickCard(this.drXyloxxzlphrex);
            expect(this.drXyloxxzlphrex.tokens.power).toBe(3);
        });

        it('should allow the player to select 0 cards', function () {
            this.player1.reap(this.crimsonDax);
            expect(this.player1).toHavePrompt('Crimson Dax');
            expect(this.player1.currentButtons).toContain('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
