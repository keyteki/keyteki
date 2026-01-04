describe('Predatory Lending', function () {
    describe("Predatory Lending's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['predatory-lending'],
                    inPlay: ['urchin', 'umbra', 'hunting-witch']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'ember-imp']
                }
            });
        });

        it('should exalt and enrage an enemy creature when played', function () {
            this.player1.play(this.predatoryLending);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.amber).toBe(1);
            expect(this.krump.enraged).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should pay opponent 1 amber for each enemy Shadows creature when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.predatoryLending);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            expect(this.predatoryLending.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
