describe('Freedom to Be', function () {
    describe("Freedom to Be's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 10,
                    house: 'skyborn',
                    hand: ['freedom-to-be', 'bosun-creen', 'ley-earl-of-hurl'],
                    inPlay: ['gub', 'charette']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should forge a key at +4 cost', function () {
            this.player1.play(this.freedomToBe);
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should forge a key at +3 cost with one Skyborn flank creature', function () {
            this.player1.playCreature(this.bosunCreen, true);
            this.player1.play(this.freedomToBe);
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should forge a key at +2 cost with one Skyborn flank creature', function () {
            this.player1.playCreature(this.bosunCreen, true);
            this.player1.playCreature(this.leyEarlOfHurl);
            this.player1.play(this.freedomToBe);
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
