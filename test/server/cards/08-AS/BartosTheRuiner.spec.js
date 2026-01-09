describe('Bartos the Ruiner', function () {
    describe("Bartos the Ruiner's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['rowdy-skald', 'the-warchest'],
                    hand: ['bonecrusher']
                },
                player2: {
                    inPlay: ['bartos-the-ruiner', 'com-officer-palik', 'future-booster']
                }
            });
        });

        it('should destroy non-mars creature on reap', function () {
            this.player1.reap(this.rowdySkald);
            expect(this.rowdySkald.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy non-mars creature on fight', function () {
            this.player1.fightWith(this.rowdySkald, this.comOfficerPalik);
            expect(this.rowdySkald.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not destroy non-mars creature after fight if Bartos dies', function () {
            this.player1.fightWith(this.rowdySkald, this.bartosTheRuiner);
            expect(this.rowdySkald.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy non-mars creature on action', function () {
            this.player1.playUpgrade(this.bonecrusher, this.rowdySkald);
            this.player1.useAction(this.rowdySkald);
            this.player1.clickCard(this.comOfficerPalik);
            expect(this.rowdySkald.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not destroy a mars-enhanced creature on reap', function () {
            this.rowdySkald.enhancements = ['mars'];
            this.player1.reap(this.rowdySkald);
            expect(this.rowdySkald.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy a non-mars artifact on use', function () {
            this.player1.useAction(this.theWarchest);
            expect(this.theWarchest.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy our own non-mars creature on reap', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.reap(this.comOfficerPalik);
            expect(this.comOfficerPalik.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should destroy our own non-mars artifact on reap', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.useAction(this.futureBooster, true);
            this.player2.clickPrompt('Leave on top of deck');
            expect(this.futureBooster.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not destroy a mars creature on reap', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.reap(this.bartosTheRuiner);
            expect(this.bartosTheRuiner.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
