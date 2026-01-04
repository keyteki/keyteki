describe('Lieutenant Halasta', function () {
    describe("Lieutenant Halasta's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['lieutenant-halasta'],
                    inPlay: ['charette', 'cpo-zytar']
                },
                player2: {
                    inPlay: ['flaxia', 'senator-shrix', 'dust-pixie']
                }
            });
        });

        it('can stun a creature on reap', function () {
            this.player1.playCreature(this.lieutenantHalasta);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.reap(this.lieutenantHalasta);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can stun the most powerful enemy creature on scrap', function () {
            this.player1.scrap(this.lieutenantHalasta);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.stunned).toBe(true);
            expect(this.lieutenantHalasta.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
