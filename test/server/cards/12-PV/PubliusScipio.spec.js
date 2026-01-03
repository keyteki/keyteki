describe('Publius Scipio', function () {
    describe("Publius Scipio's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['urchin', 'hunting-witch'],
                    hand: ['publius-scipio'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'krump', 'dust-pixie']
                }
            });
        });

        it('should deal 4 damage to neighbors after using a friendly creature', function () {
            this.player1.activateProphecy(this.overreach, this.publiusScipio);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.krump.tokens.damage).toBeUndefined();
            expect(this.dustPixie.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.publiusScipio.location).toBe('discard');
            expect(this.urchin.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
