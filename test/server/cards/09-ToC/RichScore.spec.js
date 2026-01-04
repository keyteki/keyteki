describe('Rich Score', function () {
    describe("Rich Score's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'stooge',
                    hand: ['rich-score'],
                    inPlay: ['stooge:toad', 'stooge:toad']
                },
                player2: {
                    amber: 4,
                    token: 'prospector',
                    inPlay: ['prospector:dust-pixie']
                }
            });

            this.stooge3 = this.player1.player.deck[0];
        });

        it('shoud make a token, and steal amber for half of friendly token', function () {
            this.player1.play(this.richScore);
            this.player1.clickPrompt('Right');
            expect(this.stooge3.location).toBe('play area');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
