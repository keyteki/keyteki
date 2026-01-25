describe('Signal Fire', function () {
    describe("Signal Fire's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: [
                        'bumpsy',
                        'dextre',
                        'guji-dinosaur-hunter',
                        'the-warchest',
                        'signal-fire'
                    ]
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should allow brobnar creatures to fight but not reap', function () {
            this.player1.useOmni(this.signalFire);
            expect(this.signalFire.location).toBe('discard');
            this.player1.clickCard(this.bumpsy);
            expect(this.player1).toHavePrompt('Bumpsy');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not affect non-brobnar creatures', function () {
            this.player1.useOmni(this.signalFire);
            this.player1.clickCard(this.dextre);
            expect(this.player1).toHavePrompt('Dextre');
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow brobnar creatures to use action abilities', function () {
            this.player1.useOmni(this.signalFire);
            this.player1.clickCard(this.gujiDinosaurHunter);
            expect(this.player1).toHavePrompt('Guji Dinosaur Hunter');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.troll);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow use of brobnar artifacts', function () {
            this.player1.useOmni(this.signalFire);
            this.player1.clickCard(this.theWarchest);
            expect(this.player1).not.toHavePrompt('The Warchest');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
