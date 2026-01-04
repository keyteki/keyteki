describe('Overreach', function () {
    describe("Overreach's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    prophecies: [
                        'overreach',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['rowdy-skald']
                }
            });
        });

        it('should fulfill when opponent reaps with a creature', function () {
            this.player1.activateProphecy(this.overreach, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.rowdySkald);
            this.player2.clickCard(this.rowdySkald);
            expect(this.player2.amber).toBe(3);
            expect(this.rowdySkald.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should fulfill when opponent fights with a creature', function () {
            this.player1.activateProphecy(this.overreach, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.rowdySkald, this.emberImp);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not fulfill when player reaps with a creature', function () {
            this.player1.activateProphecy(this.overreach, this.parasiticArachnoid);
            this.player1.reap(this.emberImp);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
