describe('Scout Chief Korijir', function () {
    describe("Scout Chief Korijir's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    token: 'b0-t',
                    amber: 1,
                    inPlay: ['scout-chief-korijir'],
                    hand: ['flaxia', 'sensor-chief-garcia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });

            this.player1.moveCard(this.flaxia, 'deck');
        });

        it('should make a token creature after play', function () {
            this.player1.moveCard(this.scoutChiefKorijir, 'hand');
            this.player1.play(this.scoutChiefKorijir);
            this.player1.clickPrompt('Right');
            expect(this.scoutChiefKorijir.location).toBe('play area');
            expect(this.flaxia.location).toBe('play area');
            expect(this.flaxia.name).toBe('B0-T');
        });

        it('should make a token creature after reap', function () {
            this.player1.reap(this.scoutChiefKorijir);
            this.player1.clickPrompt('Right');
            expect(this.player1.amber).toBe(2);
            expect(this.flaxia.location).toBe('play area');
            expect(this.flaxia.name).toBe('B0-T');
        });

        it('should make a token creature after fight', function () {
            this.player1.fightWith(this.scoutChiefKorijir, this.gub);
            this.player1.clickPrompt('Right');
            expect(this.scoutChiefKorijir.location).toBe('play area');
            expect(this.flaxia.location).toBe('play area');
            expect(this.flaxia.name).toBe('B0-T');
        });
    });
});
