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

            // Discard Hazard Zerp first so its Scrap: effect resolves before
            // we choose what else to discard.
            expect(this.player1).toHavePrompt('Helmsman Spears');
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            expect(this.player1).toBeAbleToSelect(this.tautauVapors);
            expect(this.player1).toBeAbleToSelect(this.hazardZerp);
            this.player1.clickCard(this.hazardZerp);

            // Hazard Zerp's Scrap: discard a card and deal 3 damage.
            expect(this.player1).toHavePrompt('Hazard Zerp');
            this.player1.clickCard(this.tautauVapors);
            // Damage Helmsman Spears (sorry guy, you’re the only creature in play.)
            this.player1.clickCard(this.helmsmanSpears);

            // Back to Helmsman Spears' discard prompt. After this discard,
            // hand is empty so the prompt auto-resolves to drawing.
            this.player1.clickCard(this.soulkeeper);

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

        it('lets you discard a card drawn by a Scrap effect during the same resolution', function () {
            this.player1.reap(this.helmsmanSpears);
            this.player1.clickCard(this.brillixPonder);
            expect(this.brillixPonder.location).toBe('discard');
            // Brillix Ponder's Scrap drew Urchin, which is now selectable as
            // an additional discard target during the same Helmsman Spears
            // resolution.
            expect(this.urchin.location).toBe('hand');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            // Hand is now empty so the discard prompt auto-resolves to draw.
            // Discarded 2 cards, so drew 2.
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
