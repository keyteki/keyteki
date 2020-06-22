describe('Truebaru', function () {
    describe("Truebaru's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'dis',
                    hand: ['truebaru']
                },
                player2: {
                    amber: 2,
                    hand: ['fear']
                }
            });
        });

        it('should remove 3 amber when played', function () {
            this.player1.play(this.truebaru);
            expect(this.player1.amber).toBe(0);
        });

        it('should not allow playing Truebaru when a player has less than 3 amber', function () {
            this.player1.amber = 2;
            this.player1.clickCard(this.truebaru);
            expect(this.player1).toHavePrompt('Truebaru');
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not give amber when Fear is played', function () {
            this.player1.play(this.truebaru);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.fear);
            this.player2.clickCard(this.truebaru);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.truebaru.location).toBe('hand');
        });
    });
});
