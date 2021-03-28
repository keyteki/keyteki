describe('Symon', function () {
    describe("Symon's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    inPlay: ['flaxia', 'symon']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should move the defender to top of deck, if both survived the fight.', function () {
            this.player1.fightWith(this.symon, this.krump);

            expect(this.symon.hasToken('damage')).toBe(false);
            expect(this.symon.location).toBe('play area');
            expect(this.player2.player.cardsInPlay).not.toContain(this.krump);
            expect(this.player2.deck[0]).toBe(this.krump);
        });

        it('should not move the defender to top of deck, if the defender was destroyed.', function () {
            this.player1.fightWith(this.symon, this.gub);

            expect(this.symon.hasToken('damage')).toBe(false);
            expect(this.symon.location).toBe('play area');
            expect(this.player2.player.cardsInPlay).not.toContain(this.gub);
            expect(this.gub.location).toBe('discard');
        });
    });
});
