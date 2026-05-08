describe('Legate Scipio', function () {
    describe("Legate Scipio's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['legate-scipio'],
                    inPlay: ['charette', 'gub', 'troll']
                },
                player2: {
                    inPlay: ['lamindra', 'tricerian-legionary']
                }
            });
        });

        it('should exalt all Saurian creatures when played', function () {
            this.player1.playCreature(this.legateScipio);
            this.player1.clickCard(this.legateScipio);
            expect(this.legateScipio.amber).toBe(1);
            expect(this.charette.amber).toBe(0);
            expect(this.gub.amber).toBe(0);
            expect(this.troll.amber).toBe(0);
            expect(this.lamindra.amber).toBe(0);
            expect(this.tricerianLegionary.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be optional', function () {
            this.player1.play(this.legateScipio);
            this.player1.clickPrompt('Done');
            expect(this.legateScipio.amber).toBe(0);
            expect(this.charette.amber).toBe(0);
            expect(this.gub.amber).toBe(0);
            expect(this.troll.amber).toBe(0);
            expect(this.lamindra.amber).toBe(0);
            expect(this.tricerianLegionary.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
