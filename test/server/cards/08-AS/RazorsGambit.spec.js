describe("Razor's Gambit", function () {
    describe("Razor's Gambit's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['razor-s-gambit', 'bosun-creen', 'umbra', 'ley-earl-of-hurl']
                },
                player2: {
                    inPlay: ['dust-pixie', 'hunting-witch']
                }
            });
        });

        it('should ready and fight with a Skyborn creature', function () {
            this.player1.reap(this.bosunCreen);
            this.player1.useAction(this.razorSGambit);
            expect(this.player1).toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).toBeAbleToSelect(this.leyEarlOfHurl);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.bosunCreen);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should repeat if blue key is forged', function () {
            this.player1.player.keys = { red: false, blue: true, yellow: false };
            this.player1.reap(this.bosunCreen);
            this.player1.useAction(this.razorSGambit);
            this.player1.clickCard(this.bosunCreen);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).toBeAbleToSelect(this.leyEarlOfHurl);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.bosunCreen);
            this.player1.clickCard(this.huntingWitch);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
