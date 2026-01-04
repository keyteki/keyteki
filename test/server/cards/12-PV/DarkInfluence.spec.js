describe('Dark Influence', function () {
    describe("Dark Influence's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    hand: ['dark-influence'],
                    discard: ['ember-imp', 'yurk', 'fandangle']
                },
                player2: {
                    amber: 4,
                    discard: ['searine', 'dark-minion', 'troll']
                }
            });
        });

        it('should discard top card of own deck and gain amber if it is a Mutant creature', function () {
            this.player1.moveCard(this.fandangle, 'deck');
            this.player1.play(this.darkInfluence);
            this.player1.clickPrompt('Mine');
            expect(this.fandangle.location).toBe('discard');
            expect(this.player1.amber).toBe(4); // pip + effect
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard top card of opponent deck and gain amber if it is a Mutant creature', function () {
            this.player2.moveCard(this.darkMinion, 'deck');
            this.player1.play(this.darkInfluence);
            this.player1.clickPrompt("Opponent's");
            expect(this.darkMinion.location).toBe('discard');
            expect(this.player1.amber).toBe(4); // pip + effect
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber if discarded card is not a Mutant creature', function () {
            this.player1.moveCard(this.yurk, 'deck');
            this.player1.play(this.darkInfluence);
            this.player1.clickPrompt('Mine');
            expect(this.yurk.location).toBe('discard');
            expect(this.player1.amber).toBe(3); // pip
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
