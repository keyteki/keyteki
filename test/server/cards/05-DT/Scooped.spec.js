describe('Scooped', function () {
    describe("Scooped's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    inPlay: ['armsmaster-molina', 'tantadlin', 'ancient-bear', 'dew-faerie'],
                    hand: ['scooped']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens', 'troll', 'lamindra'],
                    hand: ['wipe-clear']
                }
            });
        });

        it('should deal 2D to a friendly creature and not capture if destroyed', function () {
            this.player1.play(this.scooped);
            this.player1.clickCard(this.dewFaerie);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.dewFaerie.location).toBe('discard');
        });

        it('should deal 2D to a friendly creature and capture from own side if not destroyed', function () {
            this.player1.play(this.scooped);
            this.player1.clickCard(this.tantadlin);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.tantadlin.damage).toBe(2);
            expect(this.tantadlin.tokens.amber).toBe(1);
        });

        it('should deal 2D to an enemy creature and not capture if destroyed', function () {
            this.player1.play(this.scooped);
            this.player1.clickCard(this.lamindra);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.lamindra.location).toBe('discard');
        });

        it('should deal 2D to an enemy creature and capture from their side if not destroyed', function () {
            this.player1.play(this.scooped);
            this.player1.clickCard(this.troll);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.troll.damage).toBe(2);
            expect(this.troll.tokens.amber).toBe(1);
        });

        it('should deal 2D to an enemy creature and capture from their side if not destroyed due to ward', function () {
            this.lamindra.ward();
            this.player1.play(this.scooped);
            this.player1.clickCard(this.lamindra);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.lamindra.damage).toBe(0);
            expect(this.lamindra.location).toBe('play area');
            expect(this.lamindra.tokens.amber).toBe(1);
        });
    });
});
