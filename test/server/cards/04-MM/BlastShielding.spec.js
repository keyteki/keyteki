describe('blast-shielding', function () {
    describe("Blast Shielding's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: [
                        'chief-engineer-walls',
                        'cxo-taber',
                        'sci-officer-qincan',
                        'tactical-officer-moon'
                    ],
                    hand: ['blast-shielding']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra']
                }
            });
        });

        it('should should apply to a creature', function () {
            this.player1.playUpgrade(this.blastShielding, this.cxoTaber);
            expect(this.cxoTaber.location).toBe('play area');
            expect(this.cxoTaber.upgrades).toContain(this.blastShielding);
        });

        it('should get prompt to move blast shield when creature is used, and not move if they want to not move it', function () {
            this.player1.playUpgrade(this.blastShielding, this.cxoTaber);
            expect(this.cxoTaber.tokens.armor).toBe(2);
            expect(this.cxoTaber.location).toBe('play area');
            expect(this.cxoTaber.upgrades).toContain(this.blastShielding);
            this.player1.clickCard(this.cxoTaber);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.cxoTaber.upgrades).toContain(this.blastShielding);
        });

        it('should get prompt to move blast shield when creature is used, and be able to move it', function () {
            this.player1.playUpgrade(this.blastShielding, this.cxoTaber);
            expect(this.cxoTaber.location).toBe('play area');
            expect(this.cxoTaber.upgrades).toContain(this.blastShielding);
            this.player1.clickCard(this.cxoTaber);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
            this.player1.clickCard(this.sciOfficerQincan);
            expect(this.cxoTaber.upgrades).not.toContain(this.blastShielding);
            expect(this.sciOfficerQincan.upgrades).toContain(this.blastShielding);
            expect(this.sciOfficerQincan.tokens.armor).toBe(2);
        });
    });
});
