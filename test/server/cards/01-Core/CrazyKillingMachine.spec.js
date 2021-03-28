describe('Crazy Killing Machine', function () {
    describe("Crazy Killing Machine's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['crazy-killing-machine', 'dextre', 'raiding-knight'],
                    discard: ['inspiration', 'ancient-bear']
                },
                player2: {
                    inPlay: ['macis-asp', 'sequis'],
                    discard: ['bad-penny']
                }
            });
            this.player1.player.moveCard(this.inspiration, 'deck');
            this.player2.player.moveCard(this.badPenny, 'deck');
        });

        it('should discard a card from both players deck', function () {
            expect(this.inspiration.location).toBe('deck');
            expect(this.badPenny.location).toBe('deck');
            this.player1.clickCard(this.crazyKillingMachine);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.inspiration.location).toBe('discard');
            expect(this.badPenny.location).toBe('discard');
        });

        it('should prompt the controller to destroy creatures', function () {
            this.player1.clickCard(this.crazyKillingMachine);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Choose a sanctum card to destroy');
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.macisAsp);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.sequis);
            expect(this.sequis.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a shadows card to destroy');
            expect(this.player1).not.toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.macisAsp);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.macisAsp);
            expect(this.macisAsp.location).toBe('discard');
            expect(this.crazyKillingMachine.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy itself if there is not a legal target for one of houses', function () {
            this.player1.player.moveCard(this.ancientBear, 'deck');
            this.player1.clickCard(this.crazyKillingMachine);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Choose a shadows card to destroy');
            expect(this.player1).not.toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.macisAsp);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.macisAsp);
            expect(this.macisAsp.location).toBe('discard');
            expect(this.crazyKillingMachine.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
