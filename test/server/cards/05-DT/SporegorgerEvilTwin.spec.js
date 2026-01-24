describe('Sporegorger Evil Twin', function () {
    describe("Sporegorger Evil Twin's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['batdrone', 'sporegorger-evil-twin'],
                    inPlay: ['mother', 'urchin', 'nexus']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump'],
                    hand: ['dust-pixie']
                }
            });
        });

        it('should gain all in play power tokens from creatures on play', function () {
            this.mother.addToken('power');
            this.urchin.addToken('power');
            this.krump.addToken('power');
            this.krump.addToken('power');

            this.player1.play(this.sporegorgerEvilTwin);

            expect(this.mother.powerCounters).toBe(0);
            expect(this.urchin.powerCounters).toBe(0);
            expect(this.krump.powerCounters).toBe(0);
            expect(this.sporegorgerEvilTwin.powerCounters).toBe(4);
        });

        it('should give choice to remove all tokens, and leave them if the user chooses to keep them', function () {
            this.mother.addToken('power');
            this.urchin.addToken('power');
            this.krump.addToken('power');
            this.krump.addToken('power');
            this.player1.play(this.sporegorgerEvilTwin);

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.reap(this.sporegorgerEvilTwin);
            expect(this.sporegorgerEvilTwin.powerCounters).toBe(4);
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');
            this.player1.clickPrompt('No');
            expect(this.sporegorgerEvilTwin.powerCounters).toBe(4);
        });

        it('deal damage to other cretures if player chooses to remove them', function () {
            this.mother.addToken('power');
            this.urchin.addToken('power');
            this.krump.addToken('power');
            this.krump.addToken('power');
            this.player1.play(this.sporegorgerEvilTwin);

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.reap(this.sporegorgerEvilTwin);
            expect(this.sporegorgerEvilTwin.powerCounters).toBe(4);
            this.player1.clickPrompt('Yes');
            expect(this.sporegorgerEvilTwin.powerCounters).toBe(0);
            expect(this.sporegorgerEvilTwin.tokens.damage).toBeUndefined();
            expect(this.mother.tokens.damage).toBe(4);
            expect(this.krump.tokens.damage).toBe(4);
            expect(this.urchin.location).toBe('discard');
        });
    });
});
