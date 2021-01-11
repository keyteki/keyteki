describe('Hookmaster', function () {
    describe("Hookmaster's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    inPlay: ['hookmaster']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        it('should not make opponent lose 2 amber if tide is neutral', function () {
            this.player1.fightWith(this.hookmaster, this.murkens);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(4);
            expect(this.murkens.location).toBe('discard');
        });

        it('should not make opponent lose 2 amber if tide is low', function () {
            this.player2.changeTide('high');
            expect(this.player1.tide).toBe('low');
            this.player1.fightWith(this.hookmaster, this.murkens);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(4);
            expect(this.murkens.location).toBe('discard');
        });

        it('should make opponent lose 2 amber if tide is high', function () {
            this.player1.raiseTide();
            expect(this.player1.tide).toBe('high');
            this.player1.fightWith(this.hookmaster, this.murkens);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.murkens.location).toBe('discard');
        });
    });
});
