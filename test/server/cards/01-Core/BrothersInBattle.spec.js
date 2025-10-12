describe('Brothers in Battle', function () {
    describe("Brothers in Battle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['brothers-in-battle'],
                    inPlay: ['troll', 'bulleteye', 'batdrone']
                },
                player2: {
                    inPlay: ['hunting-witch', 'cpo-zytar']
                }
            });
        });

        it('should allow chosen house creatures to fight this turn', function () {
            this.player1.play(this.brothersInBattle);
            expect(this.player1).toHavePrompt('Brothers in Battle');
            this.player1.clickPrompt('logos');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.clickCard(this.batdrone);
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.cpoZytar);
            expect(this.cpoZytar.tokens.damage).toBe(1);
        });

        it('should not allow non-chosen house creatures to fight', function () {
            this.player1.play(this.brothersInBattle);
            this.player1.clickPrompt('logos');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1).not.toBeAbleToSelect(this.bulleteye);
            this.player1.clickCard(this.bulleteye);
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
        });

        it('should allow reaping in Brobnar', function () {
            this.player1.play(this.brothersInBattle);
            this.player1.clickPrompt('logos');
            this.player1.reap(this.troll);
            expect(this.player1.amber).toBe(2);
        });
    });
});
