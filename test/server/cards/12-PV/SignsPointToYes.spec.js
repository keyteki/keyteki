describe('Signs Point To Yes', function () {
    describe("Signs Point To Yes's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'signs-point-to-yes',
                        'expect-the-unexpected',
                        'fate-laughs-at-your-plans',
                        'bad-omen'
                    ],
                    hand: ['parasitic-arachnoid'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    amber: 5,
                    inPlay: ['rowdy-skald']
                }
            });
        });

        it('should fulfill when opponent has amber equal to key cost', function () {
            this.player1.activateProphecy(this.signsPointToYes, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.amber = 6;
            this.player2.endTurn();
            this.player2.clickCard(this.rowdySkald);
            expect(this.player2.amber).toBe(4);
            expect(this.rowdySkald.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
        });

        it('should not fulfill when opponent has less amber than key cost', function () {
            this.player1.activateProphecy(this.signsPointToYes, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.parasiticArachnoid.location).toBe('under');
        });

        it('should fulfill when opponent has more amber than key cost', function () {
            this.player1.activateProphecy(this.signsPointToYes, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.amber = 7;
            this.player2.endTurn();
            this.player2.clickCard(this.rowdySkald);
            expect(this.player2.amber).toBe(5);
            expect(this.rowdySkald.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
        });
    });
});
