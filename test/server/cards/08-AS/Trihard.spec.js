describe('Trihard', function () {
    describe("Trihard's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['trihard', 'ember-imp']
                },
                player2: {
                    hand: ['troll', 'charette', 'krump', 'anger', 'punch', 'tremor', 'pelf']
                }
            });
        });

        it('should destroy all creatures of a chosen house', function () {
            this.player1.playCreature(this.trihard);
            expect(this.player1.hand.length).toBe(1);
            expect(this.player1.discard.length).toBe(0);
            expect(this.player2.hand.length).toBe(5);
            expect(this.player2.discard.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
