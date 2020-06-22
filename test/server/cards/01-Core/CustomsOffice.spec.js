describe('Customs Office', function () {
    describe("Customs Office's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['chaos-portal'],
                    hand: ['spangler-box', 'phase-shift', 'the-vaultkeeper'],
                    discard: ['dominator-bauble']
                },
                player2: {
                    inPlay: ['customs-office']
                }
            });
            this.player1.moveCard(this.dominatorBauble, 'deck');
        });

        it('should stop players from playing artifacts when they have no amber', function () {
            this.player1.clickCard(this.spanglerBox);
            expect(this.player1).toHavePrompt('Spangler Box');
            expect(this.player1).not.toHavePromptButton('Play this artifact');
            this.player1.clickPrompt('Cancel');
            this.player1.clickCard(this.chaosPortal);
            expect(this.player1).toHavePrompt('Chaos Portal');
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Chaos Portal');
            this.player1.clickPrompt('dis');
            expect(this.dominatorBauble.location).toBe('deck');
        });

        it('should pay an amber to the opponent when they play an artifact', function () {
            this.player1.amber = 2;
            this.player1.play(this.spanglerBox);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            this.player1.clickCard(this.chaosPortal);
            expect(this.player1).toHavePrompt('Chaos Portal');
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Chaos Portal');
            this.player1.clickPrompt('dis');
            expect(this.dominatorBauble.location).toBe('play area');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
        });

        it('should pay an amber when The Vaultkeeper is in play', function () {
            this.player1.amber = 2;
            this.player1.play(this.phaseShift);
            this.player1.play(this.theVaultkeeper);
            expect(this.theVaultkeeper.location).toBe('play area');
            this.player1.play(this.spanglerBox);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });
    });
});
