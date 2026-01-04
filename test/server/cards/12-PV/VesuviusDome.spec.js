describe('Vesuvius Dome', function () {
    describe("Vesuvius Dome's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['vesuvius-dome', 'krump', 'ancient-bear'],
                    amber: 2
                },
                player2: {
                    inPlay: ['ember-imp', 'troll'],
                    amber: 2
                }
            });

            this.krump.tokens.amber = 2;
            this.ancientBear.tokens.amber = 1;
            this.emberImp.tokens.amber = 1;
            this.troll.tokens.amber = 2;
        });

        it('should move all amber from creatures to common supply, destroy all creatures, and destroy itself', function () {
            this.player1.useAction(this.vesuviusDome);

            // Check amber was moved to common supply
            expect(this.krump.tokens.amber).toBeUndefined();
            expect(this.ancientBear.tokens.amber).toBeUndefined();
            expect(this.emberImp.tokens.amber).toBeUndefined();
            expect(this.troll.tokens.amber).toBeUndefined();

            // Check creatures were destroyed
            expect(this.krump.location).toBe('discard');
            expect(this.ancientBear.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.troll.location).toBe('discard');

            // Check Vesuvius Dome was destroyed
            expect(this.vesuviusDome.location).toBe('discard');

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
