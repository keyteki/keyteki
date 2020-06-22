describe('Kymoor Eclipse', function () {
    describe("Kymoor Eclipse's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['flaxia', 'valdr', 'troll'],
                    hand: ['kymoor-eclipse']
                },
                player2: {
                    inPlay: ['lamindra', 'gub', 'spyyyder', 'streke']
                }
            });
        });

        it("Return flank's creatures to deck", function () {
            this.player1.play(this.kymoorEclipse);

            expect(this.flaxia.location).toBe('deck');
            expect(this.valdr.location).toBe('play area');
            expect(this.troll.location).toBe('deck');
            expect(this.lamindra.location).toBe('deck');
            expect(this.gub.location).toBe('play area');
            expect(this.spyyyder.location).toBe('play area');
            expect(this.streke.location).toBe('deck');
        });
    });
});
