describe('Sporegorger', function () {
    describe("Sporegorger' reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['batdrone'],
                    inPlay: ['sporegorger', 'mother', 'urchin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump'],
                    hand: ['dust-pixie']
                }
            });
        });

        it('should add power token on reap', function () {
            expect(this.sporegorger.tokens.power).toBeUndefined();
            this.player1.reap(this.sporegorger);
            expect(this.sporegorger.tokens.power).toBe(1);
        });

        it('should give choice to remove all tokens', function () {
            this.player1.reap(this.sporegorger);
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');
        });

        it('should leave tokens when player chooses to keep them', function () {
            this.player1.reap(this.sporegorger);
            this.player1.clickPrompt('No');
            expect(this.sporegorger.tokens.power).toBe(1);
        });

        it('should remove tokens when player chooses loose them', function () {
            this.player1.reap(this.sporegorger);
            this.player1.clickPrompt('Yes');
            expect(this.sporegorger.tokens.power).toBeUndefined();
        });

        it('should deal damage to all other creatures when reaping and removing all tokens', function () {
            this.player1.reap(this.sporegorger);
            this.player1.clickPrompt('Yes');
            expect(this.sporegorger.damage).toBe(0);
            expect(this.mother.damage).toBe(1);
            expect(this.krump.damage).toBe(1);
            expect(this.urchin.location).toBe('discard');
        });

        it('should deal more damage equal to number of tokens', function () {
            this.player1.reap(this.sporegorger);
            this.player1.clickPrompt('No');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.reap(this.sporegorger);
            this.player1.clickPrompt('Yes');
            expect(this.sporegorger.tokens.power).toBeUndefined();
            expect(this.sporegorger.damage).toBe(0);
            expect(this.mother.damage).toBe(2);
            expect(this.krump.damage).toBe(2);
            expect(this.urchin.location).toBe('discard');
        });
    });
});
