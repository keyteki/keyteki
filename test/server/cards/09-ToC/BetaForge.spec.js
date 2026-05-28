describe('Beta-Forge', function () {
    describe("Beta-Forge's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'logos',
                    token: 'alpha-gamma',
                    hand: ['helper-bot'],
                    inPlay: ['beta-forge'],
                    archives: new Array(12).fill('poke')
                },
                player2: {
                    amber: 2,
                    token: 'blorb',
                    hand: ['remote-access'],
                    archives: new Array(16).fill('poke')
                }
            });

            this.alphaGamma1 = this.player1.player.deck[0];
        });

        it('should make an Alpha-Gamma and stop if not enough amber', function () {
            this.player1.useAction(this.betaForge);
            expect(this.alphaGamma1.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should forge a key reduced by cards in archive', function () {
            this.player1.moveCard(this.helperBot, 'archives');
            this.player1.useAction(this.betaForge);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('blue');
            expect(this.player1.amber).toBe(0);
            expect(this.betaForge.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can be used by opponent to forge keys but not make a token', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickPrompt('No');
            this.player2.play(this.remoteAccess);
            this.player2.clickCard(this.betaForge);
            this.player2.clickPrompt('Yes');
            this.player2.forgeKey('blue');
            expect(this.player2.amber).toBe(1);
            expect(this.betaForge.location).toBe('purged');
            expect(this.player2.player.creaturesInPlay.length).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Beta-Forge with Strange Gizmo', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'logos',
                    token: 'alpha-gamma',
                    inPlay: ['beta-forge', 'strange-gizmo'],
                    archives: new Array(12).fill('poke')
                },
                player2: {
                    amber: 2,
                    token: 'blorb'
                }
            });
        });

        it('should still purge itself when Strange Gizmo destroys it mid-resolution', function () {
            this.player1.useAction(this.betaForge);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('blue');
            expect(this.player1.keys.blue).toBe(true);
            expect(this.strangeGizmo.location).toBe('discard');
            expect(this.betaForge.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
