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
                    inPlay: ['customs-office'],
                    hand: ['customs-office']
                }
            });
            this.player1.moveCard(this.dominatorBauble, 'deck');
            this.customsOffice1 = this.player2.player.cardsInPlay[0];
            this.customsOffice2 = this.player2.player.hand[0];
        });

        it('should stop opponent from playing artifacts when they have no amber', function () {
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

        it('should not stop owner when they have no amber', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.customsOffice2);
            expect(this.customsOffice2.location).toBe('play area');
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

        it('should not be able to play artifact when two custom offices are in play and 1 amber only', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.customsOffice2);
            this.player2.endTurn();
            this.player1.amber = 1;
            this.player1.clickPrompt('logos');
            this.player1.clickCard(this.spanglerBox);
            expect(this.player1).toHavePrompt('Spangler Box');
            expect(this.player1).not.toHavePromptButton('Play this artifact');
            this.player1.clickPrompt('Cancel');
        });

        it('should be able to play artifact when two custom offices are in play and player has 2 amber', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.customsOffice2);
            this.player2.endTurn();
            this.player1.amber = 2;
            this.player1.clickPrompt('logos');
            this.player1.clickCard(this.spanglerBox);
            expect(this.player1).toHavePrompt('Spangler Box');
            this.player1.play(this.spanglerBox);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
        });
    });
});
