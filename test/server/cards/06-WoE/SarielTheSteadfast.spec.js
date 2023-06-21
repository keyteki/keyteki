describe('Sariel the Steadfast', function () {
    describe("Sariel the Steadfast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['thundertow', 'giltspine-netcaster'],
                    inPlay: ['deep-priest-glebe']
                },
                player2: {
                    hand: ['thundertow', 'thundertow'],
                    inPlay: ['sariel-the-steadfast', 'pandulf-the-provoker']
                }
            });

            this.thundertow = this.player1.hand[0];
            this.thundertow2 = this.player2.hand[0];
            this.thundertow3 = this.player2.hand[1];
        });

        it('should prevent friendly creatures from becoming exhausted during enemy turns', function () {
            this.player1.play(this.thundertow);
            this.player1.clickCard(this.sarielTheSteadfast);
            this.player1.clickCard(this.deepPriestGlebe);
            this.player1.clickPrompt('Done');
            expect(this.sarielTheSteadfast.exhausted).toBe(false);
            expect(this.deepPriestGlebe.exhausted).toBe(true);
            this.player1.play(this.giltspineNetcaster);
            this.player1.clickCard(this.pandulfTheProvoker);
            expect(this.pandulfTheProvoker.exhausted).toBe(false);
        });

        it('should have no effect during friendly turns', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.play(this.thundertow2);
            this.player2.clickCard(this.sarielTheSteadfast);
            this.player2.clickCard(this.deepPriestGlebe);
            this.player2.clickPrompt('Done');
            expect(this.sarielTheSteadfast.exhausted).toBe(true);
            expect(this.deepPriestGlebe.exhausted).toBe(true);
            this.player2.play(this.thundertow3);
            this.player2.clickCard(this.sarielTheSteadfast);
            this.player2.clickCard(this.pandulfTheProvoker);
            this.player2.clickPrompt('Done');
            expect(this.pandulfTheProvoker.exhausted).toBe(true);
        });
    });
});
