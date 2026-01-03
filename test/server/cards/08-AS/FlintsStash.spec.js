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
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

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

    describe('with KeyFrog', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'untamed',
                    inPlay: ['flint-s-stash', 'keyfrog']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });
        });

        it('should allow choosing between KeyFrog printed destroyed and Flint Stash gained destroyed', function () {
            // Debug - check what destroyed reactions KeyFrog has
            this.player1.fightWith(this.keyfrog, this.troll);
            // Should prompt to choose between the two destroyed abilities
            // KeyFrog should be selectable (has 2 abilities to choose from)
            this.player1.clickPrompt('Flint’s Stash');
            this.player1.clickPrompt('Red');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            // expect(this.player1).toBeAbleToSelect(this.keyfrog);
        });

        it('should allow forging when Flint Stash triggers first to gain amber', function () {
            this.player1.fightWith(this.keyfrog, this.troll);
            // Choose Flint's Stash ability first (gain 2 amber)
            this.player1.clickCard(this.keyfrog);
            this.player1.clickPrompt('Flint’s Stash');
            expect(this.player1.amber).toBe(6);
            this.player1.clickPrompt('Red');
            // Then KeyFrog ability triggers (forge key at 6 cost)
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(0);
        });
    });
});
