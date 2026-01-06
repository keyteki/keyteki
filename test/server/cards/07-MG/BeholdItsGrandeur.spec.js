describe('Behold Its Grandeur', function () {
    describe("Behold Its Grandeur's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['behold-its-grandeur', 'crushing-tentacle', 'grappling-tentacle'],
                    inPlay: ['legendary-keyraken', 'dodger', 'umbra']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('gains amber for friendly creatures sharing a house with neighbors', function () {
            this.player1.play(this.beholdItsGrandeur);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gains up to 4 amber for creatures sharing a house with neighbors', function () {
            this.player1.playCreature(this.crushingTentacle, true);
            this.player1.playCreature(this.grapplingTentacle, true);
            this.player1.play(this.beholdItsGrandeur);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gains no amber if no creatures share a house with neighbors', function () {
            this.player1.playCreature(this.grapplingTentacle);
            this.player1.moveCard(this.dodger, 'discard');
            this.player1.play(this.beholdItsGrandeur);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
