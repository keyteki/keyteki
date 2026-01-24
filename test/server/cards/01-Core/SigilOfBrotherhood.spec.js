describe('Sigil of Brotherhood', function () {
    describe("Sigil of Brotherhood's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['sigil-of-brotherhood', 'staunch-knight', 'dust-pixie']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should allow using Sanctum creatures after sacrificing', function () {
            this.player1.useOmni(this.sigilOfBrotherhood);
            expect(this.sigilOfBrotherhood.location).toBe('discard');
            this.player1.reap(this.staunchKnight);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow using non-Sanctum creatures from other houses', function () {
            this.player1.useOmni(this.sigilOfBrotherhood);
            expect(this.sigilOfBrotherhood.location).toBe('discard');
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should only last until end of turn', function () {
            this.player1.useOmni(this.sigilOfBrotherhood);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1).not.toBeAbleToSelect(this.staunchKnight);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
