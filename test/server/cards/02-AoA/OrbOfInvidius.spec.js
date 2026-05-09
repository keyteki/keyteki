describe('Orb of Invidius', function () {
    describe("Orb of Invidius's reaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['orb-of-invidius', 'ember-imp', 'urchin']
                },
                player2: {
                    inPlay: ['krump', 'bumblebird']
                }
            });
        });

        it('stuns only the friendly creature that reaped', function () {
            this.player1.reap(this.emberImp);
            expect(this.emberImp.stunned).toBe(true);
            expect(this.urchin.stunned).toBe(false);
            expect(this.krump.stunned).toBe(false);
            expect(this.bumblebird.stunned).toBe(false);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('stuns only the enemy creature that reaped', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.krump.stunned).toBe(true);
            expect(this.bumblebird.stunned).toBe(false);
            expect(this.emberImp.stunned).toBe(false);
            expect(this.urchin.stunned).toBe(false);
            expect(this.player2.amber).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
