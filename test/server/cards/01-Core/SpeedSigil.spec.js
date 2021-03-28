describe('Speed Sigil', function () {
    describe("Speed Sigil's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['speed-sigil'],
                    hand: ['bigtwig', 'snufflegator']
                },
                player2: {
                    hand: ['sequis', 'raiding-knight']
                }
            });
        });

        it('should ready the first creature played by the controlling player', function () {
            this.player1.play(this.bigtwig);
            expect(this.bigtwig.exhausted).toBe(false);
        });

        it('should not ready the second creature played by the controlling player', function () {
            this.player1.play(this.bigtwig);
            this.player1.play(this.snufflegator);
            expect(this.snufflegator.exhausted).toBe(true);
        });

        it('should ready the first creature played by the opposing player', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.sequis);
            expect(this.sequis.exhausted).toBe(false);
        });

        it('should not ready the second creature played by the opposing player', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.sequis);
            this.player2.play(this.raidingKnight);
            expect(this.raidingKnight.exhausted).toBe(true);
        });
    });
});
