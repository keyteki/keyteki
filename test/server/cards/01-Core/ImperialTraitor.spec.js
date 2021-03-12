describe('Imperial Traitor', function () {
    describe("Imperial Traitor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['imperial-traitor']
                },
                player2: {
                    inPlay: ['francus'],
                    hand: ['foggify', 'dextre', 'protect-the-weak', 'gub', 'epic-quest', 'bulwark'],
                    discard: ['grey-monk']
                }
            });
        });

        it('should be optional', function () {
            this.player1.play(this.imperialTraitor);
            this.player1.clickPrompt('Done');
            expect(this.foggify.location).toBe('hand');
            expect(this.dextre.location).toBe('hand');
            expect(this.gub.location).toBe('hand');
            expect(this.epicQuest.location).toBe('hand');
            expect(this.bulwark.location).toBe('hand');
            expect(this.protectTheWeak.location).toBe('hand');
        });

        it('should be able to choose a sanctum card and purge it', function () {
            this.player1.play(this.imperialTraitor);
            this.player1.clickCard(this.epicQuest);
            this.player1.clickPrompt('Done');
            expect(this.foggify.location).toBe('hand');
            expect(this.dextre.location).toBe('hand');
            expect(this.gub.location).toBe('hand');
            expect(this.epicQuest.location).toBe('purged');
            expect(this.bulwark.location).toBe('hand');
            expect(this.protectTheWeak.location).toBe('hand');
        });

        it('should not be able to click Done if a sanctum card is available, but not the selected one', function () {
            this.player1.play(this.imperialTraitor);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.dextre);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.dextre);
            this.player1.clickCard(this.bulwark);
            expect(this.player1).toHavePromptButton('Done');
        });
    });

    describe('when no sanctum is in hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['imperial-traitor']
                },
                player2: {
                    inPlay: ['francus'],
                    hand: ['foggify', 'dextre', 'archimedes', 'gub', 'ember-imp', 'gateway-to-dis'],
                    discard: ['grey-monk']
                }
            });
        });

        it('should be optional', function () {
            this.player1.play(this.imperialTraitor);
            this.player1.clickPrompt('Done');
            expect(this.foggify.location).toBe('hand');
            expect(this.dextre.location).toBe('hand');
            expect(this.gub.location).toBe('hand');
            expect(this.archimedes.location).toBe('hand');
            expect(this.emberImp.location).toBe('hand');
            expect(this.gatewayToDis.location).toBe('hand');
        });

        it('should not be able to click Done if a sanctum card is not available, but another one is selected', function () {
            this.player1.play(this.imperialTraitor);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.foggify);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.foggify);
            this.player1.clickCard(this.gub);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.gub);
            expect(this.player1).toHavePromptButton('Done');
        });
    });
});
