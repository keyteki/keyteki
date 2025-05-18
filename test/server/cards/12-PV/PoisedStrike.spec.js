describe('Poised Strike', function () {
    describe("Poised Strike's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['poised-strike'],
                    inPlay: ['ember-imp'],
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

        it('when used to reap it should destroy the creature', function () {
            this.player1.playUpgrade(this.poisedStrike, this.emberImp);
            this.player1.reap(this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            expect(this.poisedStrike.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('when used to fight it should destroy the creature', function () {
            this.player1.playUpgrade(this.poisedStrike, this.emberImp);
            this.player1.fightWith(this.emberImp, this.krump);
            expect(this.emberImp.location).toBe('discard');
            expect(this.poisedStrike.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
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
