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
                    inPlay: ['troll', 'key-to-dis']
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

        it('pays opponent 1 then takes control of an enemy artifact', function () {
            this.player1.play(this.reinAndCycle);
            this.player1.clickCard(this.keyToDis);
            expect(this.keyToDis.controller).toBe(this.player1.player);
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

        it('still pays opponent 1 even if there are no enemy creatures or artifacts to take', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player2.moveCard(this.keyToDis, 'discard');
            this.player1.play(this.reinAndCycle);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('retains control of the taken creature after the turn ends', function () {
            this.player1.play(this.reinAndCycle);
            this.player1.clickCard(this.troll);
            expect(this.troll.controller).toBe(this.player1.player);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.troll.controller).toBe(this.player1.player);
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.troll.controller).toBe(this.player1.player);
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
                    inPlay: ['troll']
                }
            });
        });

        it('does not take control if the prophecy captures the amber before the transfer resolves', function () {
            this.player1.activateProphecy(this.treatEachActionAsYourLast, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.ghostlyHand);
            this.player2.play(this.reinAndCycle);
            this.player2.clickCard(this.treatEachActionAsYourLast);
            this.player2.clickCard(this.troll);
            expect(this.troll.amber).toBe(2);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.troll.controller).toBe(this.player2.player);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
