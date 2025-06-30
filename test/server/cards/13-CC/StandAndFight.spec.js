describe('Stand and Fight', function () {
    describe("Stand and Fight's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['stand-and-fight'],
                    inPlay: ['charette', 'gub']
                },
                player2: {
                    inPlay: ['umbra', 'krump']
                }
            });
        });

        it('should exalt a friendly and an enemy creature, then ready and fight with the friendly one', function () {
            this.charette.exhausted = true;
            this.player1.play(this.standAndFight);
            this.player1.clickCard(this.charette); // select friendly
            this.player1.clickCard(this.umbra); // select enemy
            expect(this.charette.tokens.amber).toBe(1);
            expect(this.umbra.tokens.amber).toBe(1);
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.charette.tokens.damage).toBe(2);
            expect(this.charette.exhausted).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
