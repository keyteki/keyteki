describe("Flint's Stash", function () {
    describe("Flint's Stash's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    inPlay: ['flint-s-stash', 'bosun-creen', 'bux-bastian', 'scalawag-finn']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });
        });

        it('should give each flank creature a destroyed ability to gain 2', function () {
            this.player1.fightWith(this.buxBastian, this.troll);
            expect(this.player1.amber).toBe(1); // non-flank
            expect(this.player2.amber).toBe(1);
            this.player1.fightWith(this.bosunCreen, this.troll);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            this.player1.fightWith(this.scalawagFinn, this.troll);
            this.player1.clickCard(this.scalawagFinn);
            expect(this.player1.amber).toBe(5); // destroyed ordering
            expect(this.player2.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
