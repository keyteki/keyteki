describe('Shĭgzisŏ Buggy', function () {
    describe("Shĭgzisŏ Buggy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    inPlay: ['bubbles', 'shĭgzisŏ-buggy']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should not gain amber if there are not friendly creatures in play', function () {
            this.player1.moveCard(this.bubbles, 'discard');
            this.player1.useAction(this.shĭgzisŏBuggy);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
        });

        it('should gain amber 2A if destroyed a friendly creature', function () {
            this.player1.useAction(this.shĭgzisŏBuggy);
            expect(this.player1).toBeAbleToSelect(this.bubbles);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.bubbles);
            expect(this.bubbles.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            this.player1.endTurn();
        });
    });
});
