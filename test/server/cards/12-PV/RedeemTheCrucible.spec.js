describe('Redeem the Crucible', function () {
    describe("Redeem the Crucible's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 10,
                    house: 'redemption',
                    hand: ['snarette', 'bordan-the-redeemed', 'redeem-the-crucible'],
                    inPlay: ['doomsayer', 'intrepid-exemplar', 'ruthless-avenger']
                },
                player2: {
                    amber: 10,
                    inPlay: ['flaxia', 'fandangle', 'troll']
                }
            });
        });

        it('should destroy all creatures and allow forging a key with reduced cost', function () {
            this.player1.play(this.redeemTheCrucible);
            expect(this.doomsayer.location).toBe('discard');
            expect(this.intrepidExemplar.location).toBe('discard');
            expect(this.ruthlessAvenger.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.fandangle.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(1); // 10 - (6 + 6 - 3 mutants) = 1
            expect(this.redeemTheCrucible.location).toBe('purged');
            this.player2.forgeKey('red');
        });

        it('should allow declining to forge', function () {
            this.player1.play(this.redeemTheCrucible);
            this.player1.clickPrompt('No');
            expect(this.player1.amber).toBe(10);
            expect(this.redeemTheCrucible.location).toBe('purged');
        });
    });
});
