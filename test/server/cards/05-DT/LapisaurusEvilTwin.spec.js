describe('Lapisaurus Evil Twin', function () {
    describe("Lapisaurus Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['lapisaurus-evil-twin', 'senator-shrix']
                },
                player2: {
                    inPlay: ['dust-imp', 'dew-faerie', 'lamindra']
                }
            });
        });

        it('exalt the defender creature', function () {
            this.player1.fightWith(this.lapisaurusEvilTwin, this.lamindra);
            expect(this.lapisaurusEvilTwin.amber).toBe(0);
            expect(this.lamindra.amber).toBe(1);
        });

        it('should not exalt the defender creature, if it is destroyed', function () {
            this.player1.fightWith(this.lapisaurusEvilTwin, this.dustImp);
            expect(this.lapisaurusEvilTwin.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.dustImp.location).toBe('discard');
        });
    });
});
