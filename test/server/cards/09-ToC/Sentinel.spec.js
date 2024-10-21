describe('Sentinel', function () {
    describe("Sentinel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'redemption',
                    token: 'sentinel',
                    inPlay: ['sentinel:toad', 'sentinel:toad', 'intrepid-exemplar']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });

            this.sentinel1 = this.player1.player.creaturesInPlay[0];
            this.sentinel2 = this.player1.player.creaturesInPlay[1];
        });

        it('should stun an enemy creature on action', function () {
            this.player1.useAction(this.sentinel1);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.sentinel1);
            expect(this.player1).not.toBeAbleToSelect(this.intrepidExemplar);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.stunned).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy a stunned enemy creature on action', function () {
            this.player1.useAction(this.sentinel1);
            this.player1.clickCard(this.dustPixie);
            this.player1.useAction(this.sentinel2);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
