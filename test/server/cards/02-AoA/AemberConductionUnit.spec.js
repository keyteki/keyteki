describe('AmberConductionUnit', function () {
    describe('AmberConductionUnit', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 2,
                    inPlay: ['æmber-conduction-unit'],
                    hand: ['murkens']
                },
                player2: {
                    amber: 0,
                    inPlay: ['troll', 'grenade-snib'],
                    hand: ['bulwark']
                }
            });
        });

        it('stuns the first creature to reap', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.grenadeSnib);

            expect(this.grenadeSnib.stunned).toBe(true);
        });

        it('stuns a creature with an onReap', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.troll);
            this.player2.clickCard(this.troll);

            expect(this.troll.stunned).toBe(true);
        });

        it('does not stun the second creature to reap', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.troll);
            this.player2.clickCard(this.troll);
            this.player2.reap(this.grenadeSnib);

            expect(this.grenadeSnib.stunned).toBe(false);
        });
    });

    describe("Amber Conduction Unit's ability outside of the main phase", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['jargogle', 'ghosthawk', 'daughter', 'brillix-ponder', 'strange-gizmo'],
                    amber: 6
                },
                player2: {
                    inPlay: ['æmber-conduction-unit'],
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
            this.brillixPonder.ward();
            this.daughter.ward();
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.endTurn();

            // Strange Gizmo causes Jargogle to play ghosthawk after forging a key
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('deploy right');
            this.player1.clickCard(this.brillixPonder);
            this.player1.clickCard(this.brillixPonder);
            this.player1.clickCard(this.daughter);
            this.player1.clickPrompt('logos');
            expect(this.brillixPonder.location).toBe('play area');
            expect(this.brillixPonder.stunned).toBe(true);
            expect(this.daughter.location).toBe('play area');
            expect(this.daughter.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
