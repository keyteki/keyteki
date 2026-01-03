describe('Lost in the Woods', function () {
    describe("Lost in the Woods's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['lost-in-the-woods'],
                    inPlay: ['dust-pixie', 'ancient-bear', 'inka-the-spider']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('should shuffle 2 friendly and 2 enemy creatures into their decks', function () {
            this.player1.play(this.lostInTheWoods);
            expect(this.player1).toHavePrompt('Lost in the Woods');
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.ancientBear);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Lost in the Woods');
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.dustPixie.location).toBe('deck');
            expect(this.ancientBear.location).toBe('deck');
            expect(this.troll.location).toBe('deck');
            expect(this.krump.location).toBe('deck');
            expect(this.inkaTheSpider.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
