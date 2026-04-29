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

            this.krump.amber = 2;
            this.ancientBear.amber = 1;
            this.emberImp.amber = 1;
            this.troll.amber = 2;
        });

        it('should move all amber from creatures to common supply, destroy all creatures, and destroy itself', function () {
            this.player1.useAction(this.vesuviusDome);

            // Check amber was moved to common supply
            expect(this.krump.amber).toBe(0);
            expect(this.ancientBear.amber).toBe(0);
            expect(this.emberImp.amber).toBe(0);
            expect(this.troll.amber).toBe(0);

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
