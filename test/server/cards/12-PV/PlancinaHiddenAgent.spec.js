describe('Plancina, Hidden Agent', function () {
    describe("Plancina, Hidden Agent's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    inPlay: ['urchin', 'plancina-hidden-agent', 'orator-hissaro', 'umbra']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'dust-pixie', 'ember-imp']
                }
            });
        });

        it('should destroy neighbors when destroyed', function () {
            this.player1.fightWith(this.plancinaHiddenAgent, this.krump);
            expect(this.urchin.location).toBe('discard');
            expect(this.plancinaHiddenAgent.location).toBe('discard');
            expect(this.oratorHissaro.location).toBe('discard');
            expect(this.umbra.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should put itself into play under your control on fate', function () {
            this.player1.moveCard(this.plancinaHiddenAgent, 'hand');
            this.player1.activateProphecy(this.overreach, this.plancinaHiddenAgent);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            this.player2.clickPrompt('Right');
            expect(this.plancinaHiddenAgent.location).toBe('play area');
            expect(this.plancinaHiddenAgent.controller).toBe(this.player2.player);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
