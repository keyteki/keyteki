describe('Mooncurser', function () {
    describe("Mooncurser's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['mooncurser']
                },
                player2: {
                    amber: 2,
                    inPlay: ['ancient-bear']
                }
            });
        });

        it('should steal 1 amber after fight', function () {
            this.player1.fightWith(this.mooncurser, this.ancientBear);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should kill creature with poison after fight', function () {
            expect(this.mooncurser.hasKeyword('skirmish')).toBe(true);
            expect(this.mooncurser.hasKeyword('poison')).toBe(true);
            this.player1.fightWith(this.mooncurser, this.ancientBear);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.mooncurser.hasToken('damage')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
