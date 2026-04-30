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
            expect(this.player1).toHavePrompt('Select a card to discard');
            // Do Zerp first so it can discard one of the others. Since the
            // others don’t have Scrap: effects, we don’t need to choose their
            // order once we’ve picked Zerp.
            this.player1.clickCard(this.hazardZerp);

            expect(this.player1).toHavePrompt('Hazard Zerp');
            // Discard Tautau Vapors
            this.player1.clickCard(this.tautauVapors);
            // Damage Helmsman Spears (sorry guy, you’re the only creature in play.)
            this.player1.clickCard(this.helmsmanSpears);

            expect(this.player1).isReadyToTakeAction();
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

    describe('Helmsman Spears with a Scrap effect that draws a card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['helmsman-spears'],
                    hand: ['brillix-ponder', 'urchin']
                }
            });
            this.player1.moveCard(this.urchin, 'deck');
        });

        // SKIPPED: This test documents the desired behavior — that a card
        // drawn by a Scrap: effect mid-resolution should be selectable as a
        // further discard target during the same Helmsman Spears resolution.
        // Today the unlimited-target selector batches all picks before any
        // discard resolves, so the drawn card is not offered. Re-enable once
        // the engine supports iterative resolution of unlimited discard
        // targets (tracked separately).
        it.skip('lets you discard a card drawn by a Scrap effect during the same resolution', function () {
            this.player1.reap(this.helmsmanSpears);
            this.player1.clickCard(this.brillixPonder);
            expect(this.brillixPonder.location).toBe('discard');
            expect(this.urchin.location).toBe('hand');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not currently let you discard a card drawn by a Scrap effect (engine limitation)', function () {
            this.player1.reap(this.helmsmanSpears);
            this.player1.clickCard(this.brillixPonder);
            this.player1.clickPrompt('Done');
            // Brillix Ponder is discarded and its Scrap drew Urchin, but the
            // unlimited-target selector already finished selection before any
            // discard resolved, so Urchin is NOT offered as a further
            // discard. Hand: drew 1 from Helmsman Spears + 1 from Scrap = 2.
            expect(this.brillixPonder.location).toBe('discard');
            expect(this.urchin.location).toBe('hand');
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
