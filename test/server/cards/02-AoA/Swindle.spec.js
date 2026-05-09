describe('Swindle', function () {
    describe("Swindle's play ability (Alpha + Omega)", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['swindle', 'urchin']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('steals 3 amber on play and ends the step due to Omega', function () {
            this.player1.play(this.swindle);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.swindle.location).toBe('discard');
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });

        it('cannot be played after another card has been played due to Alpha', function () {
            this.player1.play(this.urchin);
            this.player1.clickCard(this.swindle);
            expect(this.player1).not.toHavePromptButton('Play this action');
            this.player1.clickPrompt('Cancel');
            expect(this.swindle.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Swindle when opponent has less than 3 amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['swindle']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('only steals what the opponent has', function () {
            this.player1.play(this.swindle);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
