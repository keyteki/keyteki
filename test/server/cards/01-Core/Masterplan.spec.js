describe('Masterplan', function () {
    describe("Masterplan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['masterplan', 'virtuous-works', 'protect-the-weak', 'snufflegator'],
                    inPlay: ['lady-maxena']
                },
                player2: {
                    hand: ['remote-access'],
                    inPlay: ['dextre']
                }
            });
        });

        it('should prompt the player to put a card underneath it when played', function () {
            this.player1.play(this.masterplan);
            expect(this.player1).toHavePrompt('Masterplan');
            this.player1.clickCard(this.virtuousWorks);
            expect(this.virtuousWorks.location).toBe('purged');
            expect(this.masterplan.childCards).toContain(this.virtuousWorks);
        });

        it('should play the card when clicked', function () {
            this.player1.play(this.masterplan);
            this.player1.clickCard(this.virtuousWorks);
            expect(this.player1.amber).toBe(1);
            this.masterplan.ready();
            this.player1.clickCard(this.masterplan);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.virtuousWorks.location).toBe('discard');
            expect(this.masterplan.childCards).not.toContain(this.virtuousWorks);
            expect(this.player1.amber).toBe(4);
        });

        it('should play a creature when clicked', function () {
            this.player1.play(this.masterplan);
            this.player1.clickCard(this.snufflegator);
            expect(this.player1.amber).toBe(1);
            this.masterplan.ready();
            this.player1.clickCard(this.masterplan);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1).toHavePrompt('Snufflegator');
            expect(this.player1).toHavePromptButton('Left');
            this.player1.clickPrompt('Left');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.masterplan.location).toBe('discard');
            expect(this.masterplan.childCards).not.toContain(this.snufflegator);
            expect(this.player1.amber).toBe(1);
        });

        it('should play an upgrade when clicked', function () {
            this.player1.play(this.masterplan);
            this.player1.clickCard(this.protectTheWeak);
            expect(this.player1.amber).toBe(1);
            this.masterplan.ready();
            this.player1.clickCard(this.masterplan);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1).toHavePrompt('Protect the Weak');
            expect(this.player1).toBeAbleToSelect(this.ladyMaxena);
            expect(this.masterplan.location).toBe('play area');
            this.player1.clickCard(this.ladyMaxena);
            expect(this.protectTheWeak.location).toBe('play area');
            expect(this.ladyMaxena.upgrades).toContain(this.protectTheWeak);
            expect(this.masterplan.location).toBe('discard');
            expect(this.masterplan.childCards).not.toContain(this.protectTheWeak);
            expect(this.player1.amber).toBe(2);
        });

        it('should work properly when Remote Accessed', function () {
            this.player1.play(this.masterplan);
            this.player1.clickCard(this.virtuousWorks);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            expect(this.player2.amber).toBe(1);
            this.player2.clickCard(this.masterplan);
            expect(this.virtuousWorks.location).toBe('discard');
            expect(this.masterplan.location).toBe('discard');
            expect(this.masterplan.childCards).not.toContain(this.virtuousWorks);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('should work properly when Remote Accessed with a creature', function () {
            this.player1.play(this.masterplan);
            this.player1.clickCard(this.snufflegator);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            expect(this.player2.amber).toBe(1);
            this.player2.clickCard(this.masterplan);
            expect(this.player2).toHavePrompt('Snufflegator');
            expect(this.player2).toHavePromptButton('Left');
            this.player2.clickPrompt('Left');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.player2.player.creaturesInPlay).toContain(this.snufflegator);
            expect(this.player1.player.creaturesInPlay).not.toContain(this.snufflegator);
            expect(this.masterplan.location).toBe('discard');
            expect(this.masterplan.childCards).not.toContain(this.protectTheWeak);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should work properly when Remote Accessed with an upgrade', function () {
            this.player1.play(this.masterplan);
            this.player1.clickCard(this.protectTheWeak);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            expect(this.player2.amber).toBe(1);
            this.player2.clickCard(this.masterplan);
            expect(this.player2).toHavePrompt('Protect the Weak');
            expect(this.player2).toBeAbleToSelect(this.dextre);
            expect(this.masterplan.location).toBe('play area');
            this.player2.clickCard(this.dextre);
            expect(this.protectTheWeak.location).toBe('play area');
            expect(this.dextre.upgrades).toContain(this.protectTheWeak);
            expect(this.masterplan.location).toBe('discard');
            expect(this.masterplan.childCards).not.toContain(this.protectTheWeak);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });
    });
});
