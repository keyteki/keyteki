describe('Exploratory Craft', function () {
    describe("Exploratory Craft's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: [],
                    inPlay: ['exploratory-craft', 'mother', 'scout-pete', 'dust-pixie', 'dharna']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'urchin']
                }
            });
        });

        it('should allow to use and select no cards and draw nothing', function () {
            let startingHandSize = this.player1.hand.length;

            this.player1.useAction(this.exploratoryCraft);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.mother.exhausted).toBe(false);
            expect(this.scoutPete.exhausted).toBe(false);
            expect(this.dustPixie.exhausted).toBe(false);

            expect(this.player1.hand.length).toBe(startingHandSize);
        });

        it('should allow to use and select 2 cards to exhaust and draw', function () {
            let startingHandSize = this.player1.hand.length;

            this.player1.useAction(this.exploratoryCraft);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.scoutPete);
            this.player1.clickPrompt('Done');

            expect(this.mother.exhausted).toBe(true);
            expect(this.scoutPete.exhausted).toBe(true);
            expect(this.dustPixie.exhausted).toBe(false);

            expect(this.player1.hand.length).toBe(startingHandSize + 2);
        });

        it('should allow to use and select 3 cards to exhaust and draw', function () {
            let startingHandSize = this.player1.hand.length;

            this.player1.useAction(this.exploratoryCraft);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.scoutPete);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Done');

            expect(this.mother.exhausted).toBe(true);
            expect(this.scoutPete.exhausted).toBe(true);
            expect(this.dustPixie.exhausted).toBe(true);

            expect(this.player1.hand.length).toBe(startingHandSize + 3);
        });

        it('should not grant extra cards when those cards share a house', function () {
            let startingHandSize = this.player1.hand.length;

            this.player1.useAction(this.exploratoryCraft);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.dharna);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Done');

            expect(this.dharna.exhausted).toBe(true);
            expect(this.dustPixie.exhausted).toBe(true);

            expect(this.player1.hand.length).toBe(startingHandSize + 1);
        });

        it('should not allow to select exhausted cards', function () {
            let startingHandSize = this.player1.hand.length;

            this.mother.exhaust();

            this.player1.useAction(this.exploratoryCraft);

            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.scoutPete);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.dustPixie);

            this.player1.clickPrompt('Done');

            expect(this.mother.exhausted).toBe(true);
            expect(this.scoutPete.exhausted).toBe(false);
            expect(this.dustPixie.exhausted).toBe(true);

            expect(this.player1.hand.length).toBe(startingHandSize + 1);
        });
    });
});
