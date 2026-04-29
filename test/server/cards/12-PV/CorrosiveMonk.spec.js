describe('Corrosive Monk', function () {
    describe("Corrosive Monk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    inPlay: ['corrosive-monk', 'fandangle', 'dust-pixie', 'bull-wark']
                },
                player2: {
                    hand: ['protect-the-weak'],
                    inPlay: ['research-smoko', 'chonkers', 'raiding-knight']
                }
            });
        });

        it('should set all creatures armor to 0 and prevent gaining armor', function () {
            expect(this.raidingKnight.armor).toBe(0);
            expect(this.bullWark.armor).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.playUpgrade(this.protectTheWeak, this.researchSmoko);
            expect(this.researchSmoko.armor).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should destroy a friendly creature for each enemy Mutant when fate is triggered', function () {
            this.player1.moveCard(this.corrosiveMonk, 'hand');
            this.player1.activateProphecy(this.overreach, this.corrosiveMonk);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.reap(this.raidingKnight);
            expect(this.player2).toBeAbleToSelect(this.researchSmoko);
            expect(this.player2).toBeAbleToSelect(this.chonkers);
            expect(this.player2).toBeAbleToSelect(this.raidingKnight);
            expect(this.player2).not.toBeAbleToSelect(this.fandangle);
            expect(this.player2).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player2).not.toBeAbleToSelect(this.corrosiveMonk);
            this.player2.clickCard(this.chonkers);
            expect(this.player2).not.toHavePrompt('Done');
            this.player2.clickCard(this.raidingKnight);
            this.player2.clickPrompt('Done');
            expect(this.chonkers.location).toBe('discard');
            expect(this.raidingKnight.location).toBe('discard');
            expect(this.researchSmoko.location).toBe('play area');
            expect(this.fandangle.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.bullWark.location).toBe('play area');
            expect(this.corrosiveMonk.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
