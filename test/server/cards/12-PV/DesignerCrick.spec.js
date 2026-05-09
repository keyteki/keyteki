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
                    amber: 5,
                    hand: [
                        'krump',
                        'troll',
                        'bumpsy',
                        'smaaash',
                        'brammo',
                        'groggins',
                        'narp',
                        'narplet',
                        'punctuated-equilibrium'
                    ]
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
            expect(this.player2.amber).toBe(4);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should keep any drawn cards if discarding first with punctuated equilibrium', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.punctuatedEquilibrium);
            expect(this.player2).toHavePrompt(`Choose which player discards first`);
            this.player2.clickPrompt('Opponent');
            this.player2.clickPrompt('Autoresolve');
            expect(this.player1.hand.length).toBe(8);
            expect(this.designerCrick.amber).toBe(5);
            expect(this.player2.amber).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should discard any drawn cards if discarding second with punctuated equilibrium', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.punctuatedEquilibrium);
            expect(this.player2).toHavePrompt('Choose which player discards first');
            this.player2.clickPrompt('Me');
            this.player2.clickPrompt('Autoresolve');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player1.player.discard.length).toBe(0);
            expect(this.designerCrick.amber).toBe(5);
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
