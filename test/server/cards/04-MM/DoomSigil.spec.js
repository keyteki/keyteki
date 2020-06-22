describe('Doom Sigil', function () {
    describe("Doom Sigil's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['collector-worm', 'doom-sigil']
                },
                player2: {
                    inPlay: ['flaxia', 'gub'],
                    hand: ['gateway-to-dis']
                }
            });
        });

        it('all creatures should gain poison', function () {
            expect(this.collectorWorm.getKeywordValue('poison')).toBe(1);
            expect(this.flaxia.getKeywordValue('poison')).toBe(1);
            expect(this.gub.getKeywordValue('poison')).toBe(1);
            this.player1.fightWith(this.collectorWorm, this.flaxia);
            expect(this.flaxia.location).toBe('discard');
        });

        it('should be destroyed when there are no more creatures in play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.gatewayToDis);
            expect(this.collectorWorm.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.doomSigil.location).toBe('discard');
        });
    });
});
