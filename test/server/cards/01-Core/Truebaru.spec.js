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

    describe('Truebaru play cost on cancel', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'dis',
                    hand: ['truebaru'],
                    inPlay: ['ember-imp']
                },
                player2: {}
            });
        });

        it('should refund the 3 amber cost when the play is cancelled at the flank prompt', function () {
            this.player1.clickCard(this.truebaru);
            expect(this.player1).toHavePromptButton('Cancel');
            this.player1.clickPrompt('Cancel');
            expect(this.truebaru.location).toBe('hand');
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
