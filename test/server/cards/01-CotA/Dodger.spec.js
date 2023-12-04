describe('Dodger', function () {
    describe("Dodger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['dodger']
                },
                player2: {
                    amber: 2,
                    inPlay: ['nexus', 'bad-penny', 'macis-asp'],
                    discard: ['neffru']
                }
            });
        });

        it('should cause steal 1A after fight.', function () {
            this.player1.fightWith(this.dodger, this.nexus);
            expect(this.dodger.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            this.player1.endTurn();
        });

        it('should trigger after Neffru', function () {
            this.player2.moveCard(this.neffru, 'play area');
            this.player1.amber = 0;
            this.player2.amber = 0;
            this.player1.fightWith(this.dodger, this.badPenny);
            expect(this.dodger.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            this.player1.endTurn();
        });

        it('should not steal lose 1A if destroyed.', function () {
            this.player1.fightWith(this.dodger, this.macisAsp);
            expect(this.dodger.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });
    });
});
