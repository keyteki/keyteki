describe('Cultist', function () {
    describe("Cultist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    token: 'cultist',
                    inPlay: ['primordial-vault', 'cultist:pelf', 'cultist:troll', 'vulka']
                },
                player2: {
                    inPlay: ['kelifi-dragon', 'batdrone']
                }
            });

            this.token1 = this.player1.player.creaturesInPlay[0];
            this.token2 = this.player1.player.creaturesInPlay[1];
        });

        it('should be able to ward a friendly creature', function () {
            this.player1.useAction(this.token1);
            expect(this.token1.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.token2);
            expect(this.player1).toBeAbleToSelect(this.vulka);
            expect(this.player1).not.toBeAbleToSelect(this.kelifiDragon);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.vulka);
            expect(this.vulka.tokens.ward).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
