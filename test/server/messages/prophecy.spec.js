describe('Prophecy Messages', function () {
    describe('activating prophecy', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    prophecies: ['expect-the-unexpected', 'forge-ahead-with-confidence'],
                    hand: ['ancient-bear']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log correct message when activating a prophecy', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 activates their prophecy Expect the Unexpected'
            ]);
        });
    });

    describe('fulfilling prophecy with fate effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    prophecies: ['expect-the-unexpected', 'forge-ahead-with-confidence'],
                    hand: ['parasitic-arachnoid']
                },
                player2: {
                    hand: ['spoo-key-charge'],
                    inPlay: ['umbra'],
                    discard: ['troll']
                }
            });
            // Activate on player1's turn, then move to player2's turn
            this.player1.activateProphecy(this.expectTheUnexpected, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
        });

        it('should log correct message when prophecy is fulfilled with fate effect', function () {
            this.player2.play(this.spooKeyCharge);
            // Prophecy triggers, select creature for fate effect
            this.player2.clickCard(this.umbra);
            expect(this.player2).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 activates their prophecy Expect the Unexpected',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber',
                'player2 chooses untamed as their active house this turn',
                'player2 plays Spoo-key Charge',
                'player2 uses Spoo-key Charge',
                'player1 uses Expect the Unexpected to fulfill its prophecy',
                'player1 resolves the fate effect of Parasitic Arachnoid'
            ]);
        });
    });

    describe('fulfilling prophecy without fate effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    prophecies: ['expect-the-unexpected', 'forge-ahead-with-confidence'],
                    hand: ['ancient-bear']
                },
                player2: {
                    hand: ['spoo-key-charge'],
                    discard: ['troll']
                }
            });
            // Activate on player1's turn, then move to player2's turn
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
        });

        it('should log correct message when prophecy is fulfilled without fate effect', function () {
            this.player2.play(this.spooKeyCharge);
            expect(this.player2).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 activates their prophecy Expect the Unexpected',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber',
                'player2 chooses untamed as their active house this turn',
                'player2 plays Spoo-key Charge',
                'player2 uses Spoo-key Charge',
                'player1 uses Expect the Unexpected to fulfill its prophecy',
                'player1 resolves the fate effect of Ancient Bear'
            ]);
        });
    });
});
