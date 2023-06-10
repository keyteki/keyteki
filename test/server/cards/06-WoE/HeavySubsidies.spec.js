describe('HeavySubsidies', function () {
    describe("HeavySubsidies's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 5,
                    hand: ['bubbles'],
                    inPlay: ['sequis', 'holdfast', 'heavy-subsidies']
                },
                player2: {
                    amber: 8,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should cause extra reap amber', function () {
            let initialAmber = this.player1.amber;

            this.player1.reap(this.holdfast);

            expect(this.player1.amber).toBe(initialAmber + 2);
        });

        it("should disable player 2's forge step for <12 amber", function () {
            this.player1.endTurn();

            expect(this.player2).toHavePrompt('Choose which house you want to activate this turn');
        });

        it("should disable player 1's forge step for <12 amber", function () {
            this.player1.amber = 8;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            expect(this.player1).toHavePrompt('Choose which house you want to activate this turn');
        });

        it("should not disable player 2's forge step for >=12 amber", function () {
            this.player2.amber = 12;
            this.player1.endTurn();

            expect(this.player2).toHavePrompt('Which key would you like to forge?');
        });
    });
});
