describe('Binary Moray', function () {
    describe("Binary Moray's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'logos',
                    inPlay: ['binary-moray'],
                    hand: ['hookmaster', 'bury-riches']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        it('should archive a card', function () {
            this.player1.reap(this.binaryMoray);
            expect(this.player1).toBeAbleToSelect(this.hookmaster);
            expect(this.player1).toBeAbleToSelect(this.buryRiches);
            this.player1.clickCard(this.buryRiches);
            expect(this.buryRiches.location).toBe('archives');
        });

        describe('when owner raise the tide', function () {
            beforeEach(function () {
                this.binaryMoray.exhaust();
                this.player1.raiseTide();
            });

            it('should ready it', function () {
                expect(this.binaryMoray.exhausted).toBe(false);
            });
        });

        describe('when opponnent raise the tide', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.raiseTide();
            });

            it('should exhaust it', function () {
                expect(this.binaryMoray.exhausted).toBe(true);
            });
        });
    });
});
