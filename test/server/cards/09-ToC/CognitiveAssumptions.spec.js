describe('Cognitive Assumptions', function () {
    describe("Cognitive Assumptions's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'logos',
                    token: 'alpha-gamma',
                    hand: [
                        'helper-bot',
                        'dr-milli',
                        'data-forge',
                        'gub',
                        'hexpion',
                        'cognitive-assumptions'
                    ],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1
                }
            });

            this.alphaGamma1 = this.player1.player.deck[0];
            this.alphaGamma2 = this.player1.player.deck[1];
            this.alphaGamma3 = this.player1.player.deck[2];
            this.player1.play(this.cognitiveAssumptions);
        });

        it('should allow revealing 0 cards', function () {
            this.player1.clickPrompt('Done');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow revealing 1 card', function () {
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.drMilli);
            expect(this.player1).toBeAbleToSelect(this.dataForge);
            expect(this.player1).toBeAbleToSelect(this.hexpion);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.helperBot);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.alphaGamma1.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow revealing 3 cards', function () {
            this.player1.clickCard(this.helperBot);
            this.player1.clickCard(this.dataForge);
            this.player1.clickCard(this.hexpion);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.alphaGamma1.location).toBe('play area');
            expect(this.alphaGamma2.location).toBe('play area');
            expect(this.alphaGamma3.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
