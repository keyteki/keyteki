describe('Poised Strike', function () {
    describe("Poised Strike's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['poised-strike'],
                    inPlay: ['ember-imp', 'searine'],
                    prophecies: [
                        'overreach',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans',
                        'bad-omen'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['krump', 'cannon']
                }
            });
        });

        it('should not destroy the creature when it is used without readying', function () {
            this.player1.playUpgrade(this.poisedStrike, this.emberImp);
            this.player1.reap(this.emberImp);
            expect(this.emberImp.location).toBe('play area');
            expect(this.poisedStrike.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy the creature when it readies at end of turn', function () {
            this.player1.playUpgrade(this.poisedStrike, this.emberImp);
            this.player1.reap(this.emberImp); // Use the creature to exhaust it
            expect(this.emberImp.exhausted).toBe(true);
            expect(this.emberImp.location).toBe('play area');
            this.player1.reap(this.searine);
            this.player1.endTurn();
            expect(this.emberImp.location).toBe('discard');
            expect(this.searine.location).toBe('play area');
            expect(this.poisedStrike.location).toBe('discard');
        });

        it('should not destroy the creature when it is used without readying', function () {
            this.player1.playUpgrade(this.poisedStrike, this.emberImp);
            this.player1.endTurn();
            expect(this.emberImp.location).toBe('play area');
            expect(this.poisedStrike.location).toBe('play area');
            this.player2.clickPrompt('brobnar');
        });

        it('when fate is activated it should skip the ready cards step', function () {
            this.player1.activateProphecy(this.overreach, this.poisedStrike);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            this.player2.clickCard(this.krump);
            expect(this.poisedStrike.location).toBe('discard');
            this.player2.useAction(this.cannon);
            this.player2.clickCard(this.emberImp);
            this.player2.endTurn();
            expect(this.krump.exhausted).toBe(true);
            expect(this.cannon.exhausted).toBe(true);
            // Lasts only one turn.
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.krump.exhausted).toBe(false);
            expect(this.cannon.exhausted).toBe(false);
        });
    });
});
