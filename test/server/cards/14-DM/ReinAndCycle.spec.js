describe('Rein and Cycle', function () {
    describe("Rein and Cycle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    hand: ['rein-and-cycle']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('pays opponent 1 then takes control of an enemy creature', function () {
            this.player1.play(this.reinAndCycle);
            this.player1.clickCard(this.troll);
            expect(this.troll.controller).toBe(this.player1.player);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not take control if controller has no amber to pay', function () {
            this.player1.amber = 0;
            this.player1.play(this.reinAndCycle);
            expect(this.troll.controller).toBe(this.player2.player);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Rein and Cycle ordering with Treat Each Action as Your Last', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'treat-each-action-as-your-last',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid']
                },
                player2: {
                    house: 'shadows',
                    amber: 0,
                    hand: ['ghostly-hand', 'rein-and-cycle'],
                    inPlay: ['urchin', 'troll']
                }
            });
        });

        it('does not take control if the prophecy captures the amber before the transfer resolves', function () {
            this.player1.activateProphecy(this.treatEachActionAsYourLast, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            // First action so the rein and cycle counts as the second
            this.player2.play(this.ghostlyHand);
            // Play rein and cycle (2nd action this turn): both prophecy reaction
            // and rein and cycle's play effect queue. Active player resolves the
            // prophecy first, capturing player2's last amber.
            this.player2.play(this.reinAndCycle);
            // Resolve the prophecy reaction before Rein and Cycle's effect.
            this.player2.clickCard(this.treatEachActionAsYourLast);
            // Parasitic Arachnoid's fate captures 2 from player2's pool to a friendly creature.
            this.player2.clickCard(this.urchin);
            // Player2 had 2 amber from Ghostly Hand bonus icons; capture removed both.
            expect(this.urchin.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            // Rein and Cycle's transfer can no longer pay → does nothing.
            expect(this.troll.controller).toBe(this.player2.player);
            expect(this.player1.amber).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
