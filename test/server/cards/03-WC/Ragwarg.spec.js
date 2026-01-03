describe('Ragwarg', function () {
    describe('Ragwarg', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 2,
                    inPlay: ['ragwarg', 'murkens']
                },
                player2: {
                    amber: 0,
                    inPlay: ['troll', 'grenade-snib'],
                    hand: ['bulwark']
                }
            });
        });

        it('damages the first creature to reap', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.grenadeSnib);
            expect(this.grenadeSnib.location).toBe('discard');
        });

        it('damages a creature with an onReap', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.troll);
            this.player2.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
        });

        it('does not damage the second creature to reap', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.troll);
            this.player2.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            this.player2.reap(this.grenadeSnib);
            expect(this.grenadeSnib.tokens.damage).toBe(undefined);
        });

        it('deals damage to own creatures when reaping', function () {
            this.player1.reap(this.murkens);
            expect(this.murkens.location).toBe('discard');
        });
    });

    describe("Ragwarg's ability outside of the main phase", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['jargogle', 'ghosthawk', 'daughter', 'brillix-ponder', 'strange-gizmo'],
                    amber: 6
                },
                player2: {
                    inPlay: ['ragwarg'],
                    amber: 0
                }
            });
        });

        it('should count creatures reaping during start of turn', function () {
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.ghosthawk);
            this.player1.play(this.brillixPonder);
            this.player1.play(this.daughter);
            this.player1.play(this.strangeGizmo);
            this.brillixPonder.tokens.ward = 1;
            this.daughter.tokens.ward = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            // Strange Gizmo causes Jargogle to play ghosthawk after forging a key
            this.player1.clickPrompt('red');
            this.player1.clickPrompt('deploy right');
            this.player1.clickCard(this.brillixPonder); // Deploy ghosthawk right of Brillix Ponder
            this.player1.clickCard(this.brillixPonder); // Reap with Brillix Ponder and damage from Ragwarg
            this.player1.clickCard(this.daughter); // Reap with Daughter
            this.player1.clickPrompt('logos');
            expect(this.brillixPonder.location).toBe('play area');
            expect(this.brillixPonder.tokens.damage).toBe(2); // Reaped first and damaged by Ragwarg
            expect(this.daughter.location).toBe('play area'); // Reaped second and not damaged by Ragwarg
            expect(this.daughter.tokens.damage).toBe(undefined);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
