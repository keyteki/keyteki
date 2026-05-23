describe('Prophecy Menu Commands', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'untamed',
                prophecies: [
                    'expect-the-unexpected',
                    'forge-ahead-with-confidence',
                    'the-cards-will-tell',
                    'overreach'
                ],
                hand: ['ancient-bear', 'parasitic-arachnoid', 'invigorating-shower'],
                inPlay: ['mushroom-man']
            },
            player2: {
                amber: 5,
                hand: ['spoo-key-charge', 'warfaline'],
                inPlay: ['hunting-witch', 'umbra']
            }
        });

        this.game.manualMode = true;
    });

    describe('activate prophecy', function () {
        it('should allow activating an inactive prophecy via menu', function () {
            expect(this.expectTheUnexpected.activeProphecy).toBe(false);
            expect(this.ancientBear.location).toBe('hand');

            // Use the menu to activate the prophecy
            this.player1.menuClick(this.expectTheUnexpected, 'activateProphecy');

            // Check if we have the card selection prompt and click the card
            if (
                this.player1.hasPrompt('Choose a card from your hand to place under the prophecy')
            ) {
                this.player1.clickCard(this.ancientBear);
            }

            expect(this.expectTheUnexpected.activeProphecy).toBe(true);
            expect(this.ancientBear.location).toBe('under');
            expect(this.expectTheUnexpected.childCards.length).toBe(1);
            expect(this.expectTheUnexpected.childCards[0]).toBe(this.ancientBear);
        });

        it('should not allow activating an already active prophecy', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            expect(this.expectTheUnexpected.activeProphecy).toBe(true);

            // Menu click should not work for already active prophecy for activation
            this.player1.menuClick(this.expectTheUnexpected, 'activateProphecy');
            // Should still only have one child card
            expect(this.expectTheUnexpected.childCards.length).toBe(1);
        });

        it('should not allow activating flip side of active prophecy', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            expect(this.expectTheUnexpected.activeProphecy).toBe(true);

            // Try to activate flip side
            this.player1.menuClick(this.forgeAheadWithConfidence, 'activateProphecy');
            expect(this.forgeAheadWithConfidence.activeProphecy).toBe(false);
            expect(this.forgeAheadWithConfidence.childCards.length).toBe(0);
        });
    });

    describe('deactivate prophecy', function () {
        beforeEach(function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
        });

        it('should allow deactivating an active prophecy via menu', function () {
            expect(this.expectTheUnexpected.activeProphecy).toBe(true);
            expect(this.ancientBear.location).toBe('under');

            this.player1.menuClick(this.expectTheUnexpected, 'deactivateProphecy');

            expect(this.expectTheUnexpected.activeProphecy).toBe(false);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.expectTheUnexpected.childCards.length).toBe(0);
        });

        it('should not allow deactivating an inactive prophecy', function () {
            // First deactivate it
            this.player1.menuClick(this.expectTheUnexpected, 'deactivateProphecy');
            expect(this.expectTheUnexpected.activeProphecy).toBe(false);

            // Try to deactivate again - should not work
            this.player1.menuClick(this.expectTheUnexpected, 'deactivateProphecy');
            expect(this.expectTheUnexpected.activeProphecy).toBe(false);
        });
    });

    describe('trigger prophecy', function () {
        beforeEach(function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
        });

        it('should allow triggering prophecy when opponent is active player', function () {
            expect(this.expectTheUnexpected.activeProphecy).toBe(true);
            expect(this.ancientBear.location).toBe('under');
            expect(this.game.activePlayer).toBe(this.player2.player);

            // Player 1 (prophecy controller) should be able to trigger their prophecy during player 2's turn
            this.player1.menuClick(this.expectTheUnexpected, 'fulfillProphecy');

            expect(this.expectTheUnexpected.activeProphecy).toBe(false);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.expectTheUnexpected.childCards.length).toBe(0);
        });

        it('should not trigger prophecy during prophecy owner turn', function () {
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            expect(this.game.activePlayer).toBe(this.player1.player);
            expect(this.expectTheUnexpected.activeProphecy).toBe(true);

            // Player 1 should not be able to trigger their own prophecy during their turn
            this.player1.menuClick(this.expectTheUnexpected, 'fulfillProphecy');

            // Prophecy should still be active
            expect(this.expectTheUnexpected.activeProphecy).toBe(true);
            expect(this.ancientBear.location).toBe('under');
        });

        it('should not allow triggering inactive prophecy', function () {
            // First deactivate the prophecy
            this.player1.menuClick(this.expectTheUnexpected, 'deactivateProphecy');
            expect(this.expectTheUnexpected.activeProphecy).toBe(false);

            // Try to trigger inactive prophecy
            this.player1.menuClick(this.expectTheUnexpected, 'fulfillProphecy');
            expect(this.expectTheUnexpected.activeProphecy).toBe(false);
        });
    });

    describe('menu visibility', function () {
        it('should show correct menu options for inactive prophecy', function () {
            let menu = this.expectTheUnexpected.getMenu();
            expect(menu).toBeDefined();
            expect(
                menu.some(function (/** @type {any} */ item) {
                    return item.command === 'activateProphecy';
                })
            ).toBe(true);
            expect(
                menu.some(function (/** @type {any} */ item) {
                    return item.command === 'deactivateProphecy';
                })
            ).toBe(false);
            expect(
                menu.some(function (/** @type {any} */ item) {
                    return item.command === 'fulfillProphecy';
                })
            ).toBe(false);
        });

        it('should show correct menu options for active prophecy during owner turn', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);

            let menu = this.expectTheUnexpected.getMenu();
            expect(menu).toBeDefined();
            expect(
                menu.some(function (/** @type {any} */ item) {
                    return item.command === 'activateProphecy';
                })
            ).toBe(false);
            expect(
                menu.some(function (/** @type {any} */ item) {
                    return item.command === 'deactivateProphecy';
                })
            ).toBe(true);
            expect(
                menu.some(function (/** @type {any} */ item) {
                    return item.command === 'fulfillProphecy';
                })
            ).toBe(false);
        });

        it('should show correct menu options for active prophecy during opponent turn', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');

            let menu = this.expectTheUnexpected.getMenu();
            expect(menu).toBeDefined();
            expect(
                menu.some(function (/** @type {any} */ item) {
                    return item.command === 'activateProphecy';
                })
            ).toBe(false);
            expect(
                menu.some(function (/** @type {any} */ item) {
                    return item.command === 'deactivateProphecy';
                })
            ).toBe(true);
            expect(
                menu.some(function (/** @type {any} */ item) {
                    return item.command === 'fulfillProphecy';
                })
            ).toBe(true);
        });

        it('should not show menu for prophecy cards in non-manual mode', function () {
            this.game.manualMode = false;

            let menu = this.expectTheUnexpected.getMenu();
            expect(menu).toBeUndefined();
        });
    });
});
