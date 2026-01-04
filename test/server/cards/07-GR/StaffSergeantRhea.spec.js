describe('Staff Sergeant Rhea', function () {
    describe("Staff Sergeant Rhea's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['staff-sergeant-rhea'],
                    inPlay: ['cpo-zytar', 'gub', 'charette']
                },
                player2: {
                    inPlay: ['helmsman-spears']
                }
            });
        });

        it('can use neighbors as if star alliance', function () {
            this.player1.playCreature(this.staffSergeantRhea);
            this.player1.reap(this.charette);
            expect(this.player1.amber).toBe(2);
            this.player1.clickCard(this.gub);
            expect(this.player1).isReadyToTakeAction();
            this.player1.reap(this.cpoZytar);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can still use neighbors as their original house', function () {
            this.player1.playCreature(this.staffSergeantRhea);
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.clickCard(this.charette);
            expect(this.player2).isReadyToTakeAction();
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.reap(this.charette);
        });

        it('can ready and use a friendly creature on scrap', function () {
            this.player1.scrap(this.staffSergeantRhea);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
            expect(this.staffSergeantRhea.location).toBe('discard');
        });
    });
});
