describe('Twin Bolt Emission', function () {
    describe("Twin Bolt Emission's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['doc-bookton'],
                    hand: ['dextre', 'twin-bolt-emission']
                },
                player2: {
                    inPlay: ['inka-the-spider']
                }
            });
        });

        it('should allow friendly and enemy creatures to be selected, and deal damage to both', function () {
            this.player1.play(this.twinBoltEmission);
            expect(this.player1).toHavePrompt('Twin Bolt Emission');
            expect(this.player1).toBeAbleToSelect(this.docBookton);
            expect(this.player1).toBeAbleToSelect(this.inkaTheSpider);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.inkaTheSpider);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.docBookton);
            this.player1.clickPrompt('Done');
            expect(this.inkaTheSpider.location).toBe('discard');
            expect(this.docBookton.tokens.damage).toBe(2);
        });

        it('should only deal damage to a single target if there is only one creature on the board', function () {
            this.player1.fightWith(this.docBookton, this.inkaTheSpider);
            expect(this.inkaTheSpider.location).toBe('discard');
            expect(this.docBookton.location).toBe('discard');
            this.player1.play(this.dextre);
            this.player1.play(this.twinBoltEmission);
            expect(this.player1).toHavePrompt('Twin Bolt Emission');
            expect(this.player1).not.toBeAbleToSelect(this.docBookton);
            expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.dextre);
            this.player1.clickPrompt('Done');
            expect(this.dextre.tokens.damage).toBe(2);
        });

        it('should not resolve if there are no creatures in play', function () {
            this.player1.fightWith(this.docBookton, this.inkaTheSpider);
            expect(this.inkaTheSpider.location).toBe('discard');
            expect(this.docBookton.location).toBe('discard');
            this.player1.play(this.twinBoltEmission);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(1);
        });
    });
});
