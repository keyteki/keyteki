describe('Hand Cannon', function () {
    describe("LHand Cannon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'shadows',
                    inPlay: ['lamindra'],
                    hand: ['hand-cannon']
                },
                player2: {
                    inPlay: ['dust-imp', 'dew-faerie', 'toad']
                }
            });

            this.lamindra.tokens.amber = 2;
            this.player1.playUpgrade(this.handCannon, this.lamindra);
        });

        it('should gain skirmish while attached', function () {
            expect(this.lamindra.getKeywordValue('skirmish')).toBe(1);
        });

        it('should move 1A to opponent after fight', function () {
            this.player1.fightWith(this.lamindra, this.dustImp);
            expect(this.lamindra.amber).toBe(1);
            expect(this.dustImp.amber).toBe(1);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
            this.player1.endTurn();
        });

        it('should not move 1A the defender creature, if it is destroyed', function () {
            this.player1.fightWith(this.lamindra, this.toad);
            expect(this.lamindra.amber).toBe(2);
            expect(this.toad.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
            this.player1.endTurn();
        });
    });
});
