describe('Purify', function () {
    integration(function () {
        describe("Purify's ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: ['dis-ambassador', 'pismire'],
                        hand: ['purify'],
                        discard: ['sequis', 'munchling', 'commandeer']
                    },
                    player2: {
                        inPlay: ['gamgee', 'trimble']
                    }
                });
            });

            it('can only purge mutants', function () {
                this.player1.play(this.purify);
                expect(this.player1).not.toHavePromptButton('Done');
                expect(this.player1).toBeAbleToSelect(this.pismire);
                expect(this.player1).toBeAbleToSelect(this.trimble);
                expect(this.player1).not.toBeAbleToSelect(this.disAmbassador);
                expect(this.player1).not.toBeAbleToSelect(this.gamgee);
                this.player1.clickCard(this.trimble);
                expect(this.trimble.location).toBe('purged');
                expect(this.disAmbassador.location).toBe('play area');
            });

            it('can transform a friendly creature into a non-mutant', function () {
                this.player1.moveCard(this.commandeer, 'deck');
                this.player1.moveCard(this.sequis, 'deck');
                this.player1.moveCard(this.munchling, 'deck');
                this.player1.play(this.purify);
                this.player1.clickCard(this.pismire);

                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
                this.player1.clickPrompt('Left');

                expect(this.munchling.location).toBe('discard');
                expect(this.sequis.location).toBe('play area');
                expect(this.commandeer.location).toBe('deck');
            });

            it('can transform an enemy creature into a non-mutant', function () {
                this.player1.play(this.purify);
                this.player1.clickCard(this.trimble);
            });

            it('bases transformations on controllers, not owners', function () {});
        });
    });
});
