describe('Mushroom Pig Evil Twin', function () {
    describe("Mushroom Pig Evil Twin's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['batdrone', 'mushroom-pig-evil-twin'],
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

            this.player1.play(this.mushroomPigEvilTwin);

            expect(this.mother.tokens.power).toBeUndefined();
            expect(this.urchin.tokens.power).toBeUndefined();
            expect(this.krump.tokens.power).toBeUndefined();
            expect(this.mushroomPigEvilTwin.tokens.power).toBe(4);
        });

        it('should give choice to remove all tokens, and leave them if the user chooses to keep them', function () {
            this.mother.addToken('power');
            this.urchin.addToken('power');
            this.krump.addToken('power');
            this.krump.addToken('power');
            this.player1.play(this.mushroomPigEvilTwin);

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.reap(this.mushroomPigEvilTwin);
            expect(this.mushroomPigEvilTwin.tokens.power).toBe(4);
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');
            this.player1.clickPrompt('No');
            expect(this.mushroomPigEvilTwin.tokens.power).toBe(4);
        });

        it('deal damage to other cretures if player chooses to remove them', function () {
            this.mother.addToken('power');
            this.urchin.addToken('power');
            this.krump.addToken('power');
            this.krump.addToken('power');
            this.player1.play(this.mushroomPigEvilTwin);

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.reap(this.mushroomPigEvilTwin);
            expect(this.mushroomPigEvilTwin.tokens.power).toBe(4);
            this.player1.clickPrompt('Yes');
            expect(this.mushroomPigEvilTwin.tokens.power).toBeUndefined();
            expect(this.mushroomPigEvilTwin.tokens.damage).toBeUndefined();
            expect(this.mother.tokens.damage).toBe(4);
            expect(this.krump.tokens.damage).toBe(4);
            expect(this.urchin.location).toBe('discard');
        });
    });
});
