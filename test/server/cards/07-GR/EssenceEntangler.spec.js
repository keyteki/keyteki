describe('Essence Entangler', function () {
    describe("Essence Entangler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['essence-entangler'],
                    inPlay: ['charette', 'cpo-zytar', 'away-team']
                },
                player2: {
                    inPlay: ['senator-shrix']
                }
            });
        });

        it('can modify creature power', function () {
            this.player1.playUpgrade(this.essenceEntangler, this.senatorShrix);
            expect(this.senatorShrix.power).toBe(4);
            this.senatorShrix.tokens.amber = 3;
            this.player1.reap(this.cpoZytar);
            expect(this.senatorShrix.power).toBe(1);
            this.senatorShrix.tokens.amber = 5;
            this.player1.reap(this.awayTeam);
            expect(this.senatorShrix.location).toBe('discard');
            expect(this.player1.amber).toBe(9);
        });

        it('can move an amber on scrap', function () {
            this.charette.tokens.amber = 2;
            this.player1.scrap(this.essenceEntangler);
            this.player1.clickCard(this.charette);
            this.player1.clickCard(this.senatorShrix);
            expect(this.charette.amber).toBe(1);
            expect(this.senatorShrix.amber).toBe(1);
            expect(this.essenceEntangler.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
