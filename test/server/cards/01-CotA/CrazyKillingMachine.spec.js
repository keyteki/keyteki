describe('Crazy Killing Machine', function () {
    describe("Crazy Killing Machine's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: [
                        'crazy-killing-machine',
                        'dextre',
                        'raiding-knight',
                        'hallowed-blaster',
                        'helper-bot'
                    ],
                    discard: ['inspiration', 'ancient-bear']
                },
                player2: {
                    inPlay: ['macis-asp', 'sequis', 'hideaway-hole'],
                    discard: ['bad-penny', 'burning-glare', 'zorg']
                }
            });
        });

        it('should prompt the controller to destroy creatures or artifacts', function () {
            this.player1.player.moveCard(this.inspiration, 'deck');
            this.player2.player.moveCard(this.badPenny, 'deck');

            this.player1.useAction(this.crazyKillingMachine);
            expect(this.inspiration.location).toBe('discard');
            expect(this.badPenny.location).toBe('discard');

            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.hallowedBlaster);
            expect(this.player1).not.toBeAbleToSelect(this.macisAsp);
            expect(this.player1).not.toBeAbleToSelect(this.hideawayHole);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.sequis);

            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).not.toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.hallowedBlaster);
            expect(this.player1).toBeAbleToSelect(this.hideawayHole);
            expect(this.player1).toBeAbleToSelect(this.macisAsp);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.hideawayHole);

            expect(this.sequis.location).toBe('discard');
            expect(this.hideawayHole.location).toBe('discard');
            expect(this.crazyKillingMachine.location).toBe('play area');
            this.player1.endTurn();
        });

        it('should prompt the controller to destroy creatures or artifacts of same house', function () {
            this.player1.player.moveCard(this.inspiration, 'deck');
            this.player2.player.moveCard(this.burningGlare, 'deck');

            this.player1.useAction(this.crazyKillingMachine);
            expect(this.inspiration.location).toBe('discard');
            expect(this.burningGlare.location).toBe('discard');

            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.hallowedBlaster);
            expect(this.player1).not.toBeAbleToSelect(this.macisAsp);
            expect(this.player1).not.toBeAbleToSelect(this.hideawayHole);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.sequis);

            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.hallowedBlaster);
            expect(this.player1).not.toBeAbleToSelect(this.hideawayHole);
            expect(this.player1).not.toBeAbleToSelect(this.macisAsp);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.hallowedBlaster);

            expect(this.sequis.location).toBe('discard');
            expect(this.hallowedBlaster.location).toBe('discard');
            expect(this.crazyKillingMachine.location).toBe('play area');
            this.player1.endTurn();
        });

        it('should destroy itself if there is not a legal target for one of houses', function () {
            this.player1.player.moveCard(this.ancientBear, 'deck');
            this.player2.player.moveCard(this.badPenny, 'deck');

            this.player1.useAction(this.crazyKillingMachine);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.badPenny.location).toBe('discard');

            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).not.toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.hallowedBlaster);
            expect(this.player1).toBeAbleToSelect(this.hideawayHole);
            expect(this.player1).toBeAbleToSelect(this.macisAsp);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.macisAsp);

            expect(this.macisAsp.location).toBe('discard');
            expect(this.crazyKillingMachine.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should be able to choose itself', function () {
            this.player1.player.moveCard(this.dextre, 'deck');
            this.player2.player.moveCard(this.zorg, 'deck');

            this.player1.useAction(this.crazyKillingMachine);
            expect(this.player1).toBeAbleToSelect(this.crazyKillingMachine);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            this.player1.clickCard(this.crazyKillingMachine);
            expect(this.dextre.location).toBe('discard');
            expect(this.zorg.location).toBe('discard');

            expect(this.crazyKillingMachine.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should destroy itself if there is not a legal target for both houses', function () {
            this.player1.player.moveCard(this.ancientBear, 'deck');
            this.player2.player.moveCard(this.zorg, 'deck');

            this.player1.useAction(this.crazyKillingMachine);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.zorg.location).toBe('discard');

            expect(this.crazyKillingMachine.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should destroy itself if one of the decks is empty', function () {
            this.player1.player.moveCard(this.inspiration, 'deck');
            this.player2.player.deck = [];

            this.player1.useAction(this.crazyKillingMachine);
            expect(this.inspiration.location).toBe('discard');

            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.hallowedBlaster);
            expect(this.player1).not.toBeAbleToSelect(this.hideawayHole);
            expect(this.player1).not.toBeAbleToSelect(this.macisAsp);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.sequis);

            expect(this.sequis.location).toBe('discard');
            expect(this.crazyKillingMachine.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should destroy itself if decks are empty', function () {
            this.player1.player.deck = [];
            this.player2.player.deck = [];

            this.player1.useAction(this.crazyKillingMachine);
            expect(this.crazyKillingMachine.location).toBe('discard');
            this.player1.endTurn();
        });
    });
});
