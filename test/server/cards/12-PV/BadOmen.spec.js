describe('Bad Omen', function () {
    describe("Bad Omen's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    prophecies: [
                        'bad-omen',
                        'expect-the-unexpected',
                        'fate-laughs-at-your-plans',
                        'forge-ahead-with-confidence'
                    ],
                    hand: ['ancient-bear', 'parasitic-arachnoid'],
                    inPlay: ['mushroom-man']
                },
                player2: {
                    hand: ['spoo-key-charge'],
                    inPlay: ['hunting-witch']
                }
            });
        });

        it('should fulfill when opponent has exactly 6 amber at end of their turn', function () {
            this.player1.activateProphecy(this.badOmen, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.amber = 6;
            this.player2.endTurn();
            expect(this.player2).toBeAbleToSelect(this.huntingWitch);
            expect(this.player2).not.toBeAbleToSelect(this.mushroomMan);
            this.player2.clickCard(this.huntingWitch);
            expect(this.player2.amber).toBe(4);
            expect(this.huntingWitch.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
        });

        it('should not fulfill when opponent has less than 6 amber at end of their turn', function () {
            this.player1.activateProphecy(this.badOmen, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.amber = 5;
            this.player2.endTurn();
            expect(this.parasiticArachnoid.location).toBe('under');
            this.player1.clickPrompt('untamed');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not fulfill when opponent has more than 6 amber at end of their turn', function () {
            this.player1.activateProphecy(this.badOmen, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.amber = 7;
            this.player2.endTurn();
            expect(this.parasiticArachnoid.location).toBe('under');
            this.player1.clickPrompt('untamed');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not fulfill when you have exactly 6 amber at end of your turn', function () {
            this.player1.activateProphecy(this.badOmen, this.parasiticArachnoid);
            this.player1.amber = 6;
            this.player1.endTurn();
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).toHavePrompt('Choose which house you want to activate this turn');
        });

        it('should not fulfill when opponent has exactly 6 amber during their turn', function () {
            this.player1.activateProphecy(this.badOmen, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.amber = 6;
            this.player2.play(this.spooKeyCharge);
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
