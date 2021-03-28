describe('Universal Translator', function () {
    describe("Universal Translator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['lieutenant-khrkhar', 'mother', 'tactical-officer-moon'],
                    hand: ['universal-translator']
                },
                player2: {
                    inPlay: ['nexus', 'bulwark', 'sequis']
                }
            });
        });
        it('should let you use a non-sa creature on reap', function () {
            this.player1.playUpgrade(this.universalTranslator, this.lieutenantKhrkhar);
            this.player1.reap(this.lieutenantKhrkhar);
            expect(this.player1).toHavePrompt('Lieutenant Khrkhar');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.tacticalOfficerMoon);
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            this.player1.clickCard(this.mother);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(3);
        });
        it('should let you use a non-sa creature on fight', function () {
            this.player1.playUpgrade(this.universalTranslator, this.lieutenantKhrkhar);
            this.player1.fightWith(this.lieutenantKhrkhar, this.nexus);
            expect(this.player1).toHavePrompt('Lieutenant Khrkhar');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.tacticalOfficerMoon);
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            this.player1.clickCard(this.mother);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(2);
        });
    });
});
