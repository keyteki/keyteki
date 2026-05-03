describe('Malforge', function () {
    describe("Malforge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    amber: 6,
                    inPlay: ['malforge']
                },
                player2: {
                    house: 'shadows'
                }
            });
        });

        it('prevents the controller from forging keys at end of turn', function () {
            this.player1.endTurn();
            expect(this.player1.player.getForgedKeys()).toBe(0);
            this.player2.clickPrompt('shadows');
            expect(this.player2).isReadyToTakeAction();
        });

        it('deals 2 to Malforge at the end of the controller turn', function () {
            this.player1.endTurn();
            expect(this.malforge.tokens.damage).toBe(2);
            this.player2.clickPrompt('shadows');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not deal damage at the end of the opponent turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            const damageBefore = this.malforge.tokens.damage;
            this.player2.endTurn();
            this.player1.clickPrompt('skyborn');
            expect(this.malforge.tokens.damage).toBe(damageBefore);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
