describe('Free Markets', function () {
    describe("Free Markets's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['troll', 'helper-bot', 'gub'],
                    hand: ['experimental-therapy']
                },
                player2: {
                    inPlay: ['lamindra', 'flaxia', 'bulwark'],
                    hand: ['free-markets']
                }
            });
        });

        it('should gain 5 ambers', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.freeMarkets);
            expect(this.player2.amber).toBe(5);
        });

        it('should gain 6 ambers with experimental therapy', function () {
            this.player1.playUpgrade(this.experimentalTherapy, this.gub);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.freeMarkets);
            expect(this.player2.amber).toBe(6);
        });
    });

    describe("Free Markets's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['troll', 'helper-bot'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['lamindra', 'flaxia', 'bulwark'],
                    hand: ['free-markets']
                }
            });
        });

        it('should gain 5 ambers due to upgrade', function () {
            this.player1.playUpgrade(this.soulkeeper, this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.freeMarkets);
            expect(this.player2.amber).toBe(5);
        });
    });
});
