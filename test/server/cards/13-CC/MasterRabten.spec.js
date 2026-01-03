describe('Master Rabten', function () {
    describe("Master Rabten's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['mother-northelle', 'troll'],
                    hand: ['master-rabten']
                },
                player2: {
                    amber: 6,
                    inPlay: ['dust-pixie', 'revered-monk']
                }
            });
        });

        it('should make each friendly Monk creature capture 1 amber when played', function () {
            this.player1.playCreature(this.masterRabten);

            // mother-northelle and almsmaster are Monk creatures, troll is not
            expect(this.motherNorthelle.tokens.amber).toBe(1);
            expect(this.masterRabten.tokens.amber).toBe(1);
            expect(this.troll.tokens.amber).toBeUndefined();
            expect(this.reveredMonk.tokens.amber).toBeUndefined();
            expect(this.player2.amber).toBe(4);
            expect(this.player1.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should make each friendly Monk creature capture 1 amber after reaping', function () {
            this.player1.playCreature(this.masterRabten);
            this.masterRabten.exhausted = false;
            this.player1.reap(this.masterRabten);

            expect(this.reveredMonk.tokens.amber).toBeUndefined();
            expect(this.motherNorthelle.tokens.amber).toBe(2);
            expect(this.masterRabten.tokens.amber).toBe(2);
            expect(this.troll.tokens.amber).toBeUndefined();
            expect(this.player2.amber).toBe(2);
            expect(this.player1.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
