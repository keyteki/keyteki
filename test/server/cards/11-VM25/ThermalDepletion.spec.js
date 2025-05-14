describe('Thermal Depletion', function () {
    describe("Thermal Depletion's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['thermal-depletion'],
                    inPlay: ['troll']
                },
                player2: {
                    amber: 1,
                    hand: ['reap-or-sow'],
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should prevent creatures from readying until the start of your next turn', function () {
            this.player1.reap(this.troll);
            this.player1.play(this.thermalDepletion);
            this.player1.endTurn();
            expect(this.troll.exhausted).toBe(true);
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.dustPixie);
            this.player2.play(this.reapOrSow);
            this.player2.clickPrompt('Ready and reap');
            this.player2.clickCard(this.dustPixie);
            expect(this.player2.amber).toBe(2); // no amber from reap since the creature couldn't ready
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.troll.exhausted).toBe(true);
            expect(this.dustPixie.exhausted).toBe(true);
        });
    });
});
