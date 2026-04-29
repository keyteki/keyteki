describe('Hand Cannon', function () {
    describe("LHand Cannon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    inPlay: ['lamindra', 'gas-pipes-malone'],
                    hand: ['hand-cannon']
                },
                player2: {
                    inPlay: ['dust-imp', 'dew-faerie', 'toad', 'mother']
                }
            });
        });

        it('should gain skirmish while attached', function () {
            this.player1.playUpgrade(this.handCannon, this.lamindra);
            expect(this.lamindra.getKeywordValue('skirmish')).toBe(1);
        });

        it('should move 1A from target of fight to the player pool', function () {
            this.player1.playUpgrade(this.handCannon, this.lamindra);

            this.player1.amber = 2;
            this.player2.amber = 2;
            this.mother.amber = 2;

            expect(this.mother.amber).toBe(2);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);

            this.player1.fightWith(this.lamindra, this.mother);

            expect(this.mother.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);

            this.player1.endTurn();
        });

        it('should take amber away that is placed there on a creature before the fight', function () {
            this.player1.playUpgrade(this.handCannon, this.gasPipesMalone);

            this.player1.amber = 2;
            this.player2.amber = 2;

            expect(this.mother.amber).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);

            this.player1.fightWith(this.gasPipesMalone, this.mother);

            expect(this.mother.amber).toBe(0);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);

            this.player1.endTurn();
        });
    });
});
