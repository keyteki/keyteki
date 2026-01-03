describe('Red Skies', function () {
    describe("Red Skies's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['red-skies'],
                    inPlay: ['flaxia', 'bosun-creen', 'ley-earl-of-hurl']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should allow moving a Skyborn creature to a dlank and readying it', function () {
            this.player1.reap(this.bosunCreen);
            this.player1.play(this.redSkies);
            expect(this.player1).toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).toBeAbleToSelect(this.leyEarlOfHurl);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.bosunCreen);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.bosunCreen);
            expect(this.bosunCreen.exhausted).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should repeat if your red key is forged', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.reap(this.bosunCreen);
            this.player1.reap(this.leyEarlOfHurl);
            this.player1.play(this.redSkies);
            this.player1.clickCard(this.bosunCreen);
            this.player1.clickPrompt('Right');
            expect(this.player1).toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).toBeAbleToSelect(this.leyEarlOfHurl);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.leyEarlOfHurl);
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.leyEarlOfHurl);
            expect(this.leyEarlOfHurl.exhausted).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should repeat if opponent red key is forged', function () {
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.reap(this.bosunCreen);
            this.player1.reap(this.leyEarlOfHurl);
            this.player1.play(this.redSkies);
            this.player1.clickCard(this.bosunCreen);
            this.player1.clickPrompt('Right');
            expect(this.player1).toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).toBeAbleToSelect(this.leyEarlOfHurl);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.leyEarlOfHurl);
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.leyEarlOfHurl);
            expect(this.leyEarlOfHurl.exhausted).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
