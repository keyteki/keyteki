describe('Ambertracker', function () {
    describe("Ambertracker's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['silvertooth'],
                    hand: ['æmbertracker']
                },
                player2: {
                    inPlay: ['dextre', 'sequis', 'mother']
                }
            });
            this.silvertooth.addToken('amber');
            this.dextre.addToken('amber');
            this.sequis.addToken('amber', 4);
        });

        it('should deal 2 damage to each enemy unit with amber on it', function () {
            this.player1.play(this.æmbertracker);
            expect(this.dextre.tokens.damage).toBe(2);
            expect(this.mother.hasToken('damage')).toBe(false);
            expect(this.sequis.tokens.damage).toBe(2);
        });
    });
});
