describe('Wretched Anathema', function () {
    describe("Wretched Anathema's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    hand: ['wretched-anathema', 'wretched-anathema2'],
                    inPlay: ['gub']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'narp']
                }
            });
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.wretchedAnathema2, 'discard');
            this.player1.clickCard(this.wretchedAnathema);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.wretchedAnathema, 'discard');
            this.player1.clickCard(this.wretchedAnathema2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 1', function () {
            this.player1.clickCard(this.wretchedAnathema);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.wretchedAnathema2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should destroy two other creatures on play', function () {
            this.player1.playCreature(this.wretchedAnathema);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).not.toBeAbleToSelect(this.wretchedAnathema);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.narp.location).toBe('play area');
            expect(this.wretchedAnathema.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy two other creatures on reap', function () {
            this.player1.playCreature(this.wretchedAnathema);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Done');
            this.player1.moveCard(this.gub, 'play area');
            this.player2.moveCard(this.troll, 'play area');
            this.wretchedAnathema.exhausted = false;
            this.player1.reap(this.wretchedAnathema);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).not.toBeAbleToSelect(this.wretchedAnathema);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.narp.location).toBe('play area');
            expect(this.wretchedAnathema.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not gain an action if not only friendly creature', function () {
            this.player1.playCreature(this.wretchedAnathema);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.narp);
            this.player1.clickPrompt('Done');
            this.wretchedAnathema.exhausted = false;

            this.player1.clickCard(this.wretchedAnathema);
            expect(this.player1).not.toHavePromptButton("Use this card's Ability action");
            this.player1.clickPrompt('Cancel');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should have an action to gain 4 amber if no other friendly creatures', function () {
            this.player1.playCreature(this.wretchedAnathema);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Done');
            this.wretchedAnathema.exhausted = false;

            this.player1.useAction(this.wretchedAnathema);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
