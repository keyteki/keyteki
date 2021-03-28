describe('Commander Remiel', function () {
    describe("Commander Remiel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['commander-remiel', 'troll', 'sequis'],
                    hand: ['inspiration']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'inka-the-spider']
                }
            });
        });

        it('should allow using another creature', function () {
            this.player1.reap(this.commanderRemiel);
            expect(this.player1).toHavePrompt('Commander Remiel');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Troll');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).not.toHavePromptButton('Cancel');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.mightyTiger);
            expect(this.troll.exhausted).toBe(true);
            expect(this.mightyTiger.location).toBe('discard');
        });

        it('should not trigger when there are no legal targets', function () {
            this.player1.play(this.inspiration);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.inkaTheSpider);
            expect(this.troll.location).toBe('discard');
            expect(this.inkaTheSpider.location).toBe('discard');
            this.player1.reap(this.commanderRemiel);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
