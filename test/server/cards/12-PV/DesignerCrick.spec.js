describe('Designer Crick', function () {
    describe("Designer Crick's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['designer-crick'],
                    hand: ['poke']
                },
                player2: {
                    amber: 2,
                    hand: ['krump', 'ancient-bear', 'punctuated-equilibrium']
                }
            });
        });

        it('should draw a card and capture 1 amber when opponent discards', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            const player1Hand = this.player1.hand.length;
            this.player2.scrap(this.krump);
            expect(this.player1.hand.length).toBe(player1Hand + 1);
            expect(this.designerCrick.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should draw a card and capture 1 amber for each card discarded', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.punctuatedEquilibrium);
            // Both players have cards to discard, so we get prompted for order
            expect(this.player2).toHavePrompt('Choose which player discards first');
            this.player2.clickPrompt('Me');
            // Designer Crick triggers twice (once per opponent discard)
            // Need to handle triggered ability selection
            this.player2.clickPrompt('Autoresolve');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player1.player.discard.length).toBe(6);
            expect(this.designerCrick.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not trigger when controller discards', function () {
            this.player1.scrap(this.poke);
            expect(this.player1.hand.length).toBe(0);
            expect(this.designerCrick.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
