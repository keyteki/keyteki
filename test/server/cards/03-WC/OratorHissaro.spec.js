describe('Orator Hissaro', function () {
    describe("Orator Hissaro's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['troll', 'flaxia'],
                    hand: ['orator-hissaro']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
            this.troll.exhausted = true;
            this.flaxia.exhausted = true;
        });

        it('should exalt his neighbors and they will be readied and belong to house saurian', function () {
            this.player1.playCreature(this.oratorHissaro, true, true);
            this.player1.clickCard(this.flaxia);

            expect(this.oratorHissaro.hasToken('amber')).toBe(false);
            expect(this.troll.tokens.amber).toBe(1);
            expect(this.flaxia.tokens.amber).toBe(1);
            expect(this.troll.exhausted).toBe(false);
            expect(this.flaxia.exhausted).toBe(false);
            expect(this.oratorHissaro.exhausted).toBe(true);

            expect(this.flaxia.hasHouse('saurian')).toBe(true);
            expect(this.troll.hasHouse('saurian')).toBe(true);
        });

        it('should belong to house saurian for a single turn', function () {
            this.player1.playCreature(this.oratorHissaro, true, true);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.hasHouse('saurian')).toBe(true);
            expect(this.troll.hasHouse('saurian')).toBe(true);

            this.player1.endTurn();
            expect(this.flaxia.hasHouse('saurian')).toBe(false);
            expect(this.troll.hasHouse('saurian')).toBe(false);
        });
    });
});
