describe("Helmsman Spears'", function () {
    describe("Helmsman Spears' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['helmsman-spears'],
                    hand: ['soulkeeper', 'tautau-vapors', 'hazard-zerp']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });
        it('should allow discarding one card and drawing an equal amount when reaping', function () {
            this.player1.reap(this.helmsmanSpears);
            expect(this.player1).toHavePrompt('Helmsman Spears');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            expect(this.player1).toBeAbleToSelect(this.tautauVapors);
            expect(this.player1).toBeAbleToSelect(this.hazardZerp);
            this.player1.clickCard(this.soulkeeper);
            this.player1.clickPrompt('Done');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.tautauVapors.location).toBe('hand');
            expect(this.player1.hand.length).toBe(3);
        });
        it('should allow discarding cards with scrap and drawing of the equal amount when reaping', function () {
            this.player1.reap(this.helmsmanSpears);

            // Choosing what cards to discard
            expect(this.player1).toHavePrompt('Helmsman Spears');
            expect(this.player1).toHavePrompt('Choose cards');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            expect(this.player1).toBeAbleToSelect(this.tautauVapors);
            expect(this.player1).toBeAbleToSelect(this.hazardZerp);
            this.player1.clickCard(this.soulkeeper);
            this.player1.clickCard(this.tautauVapors);
            this.player1.clickCard(this.hazardZerp);
            this.player1.clickPrompt('Done');

            // Since Zerp has a Scrap: effect, we need to choose the _order_ for
            // the discards.
            expect(this.player1).toHavePrompt('Select next card to discard');
            // Do Zerp first so it can discard one of the others. Since the
            // others don’t have Scrap: effects, we don’t need to choose their
            // order once we’ve picked Zerp.
            this.player1.clickCard(this.hazardZerp);

            expect(this.player1).toHavePrompt('Hazard Zerp');
            // Discard Tautau Vapors
            this.player1.clickCard(this.tautauVapors);
            // Damage Helmsman Spears (sorry guy, you’re the only creature in play.)
            this.player1.clickCard(this.helmsmanSpears);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.tautauVapors.location).toBe('discard');
            expect(this.hazardZerp.location).toBe('discard');

            // We should only have 2 cards in hand because Helmsman Spears only
            // discarded 2 cards. Tautau Vapors was discarded by Hazard Zerp.
            expect(this.player1.hand.length).toBe(2);
        });
        it('should allow discarding any number of cards and drawing of the equal amount when fighting', function () {
            this.player1.fightWith(this.helmsmanSpears, this.nexus);
            expect(this.player1).toHavePrompt('Helmsman Spears');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            expect(this.player1).toBeAbleToSelect(this.tautauVapors);
            this.player1.clickCard(this.soulkeeper);
            this.player1.clickPrompt('Done');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.tautauVapors.location).toBe('hand');
            expect(this.player1.hand.length).toBe(3);
        });
    });
});
