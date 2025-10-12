describe('Bulleteye', function () {
    describe("Bulleteye's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['bulleteye']
                },
                player2: {
                    inPlay: ['troll', 'hunting-witch', 'cpo-zytar']
                }
            });
        });

        it('should be able to target enemy creatures', function () {
            this.player1.reap(this.bulleteye);
            expect(this.player1).toHavePrompt('Bulleteye');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
        });

        it('should be able to target friendly creatures', function () {
            this.player1.reap(this.bulleteye);
            expect(this.player1).toHavePrompt('Bulleteye');
            expect(this.player1).toBeAbleToSelect(this.bulleteye);
            this.player1.clickCard(this.bulleteye);
            expect(this.bulleteye.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
        });
    });
});
