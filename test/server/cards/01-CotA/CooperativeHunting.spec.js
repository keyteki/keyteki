describe('Cooperative Hunting', function () {
    describe("Cooperative Hunting's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['commander-remiel', 'troll', 'sequis', 'bumpsy'],
                    hand: ['cooperative-hunting']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'inka-the-spider']
                }
            });
        });

        it('should not destroy creatures until all targets have been chosen', function () {
            this.player1.play(this.cooperativeHunting);
            expect(this.player1).toHavePrompt('Cooperative Hunting');
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.inkaTheSpider);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.inkaTheSpider);
            expect(this.inkaTheSpider.hasToken('damage')).toBe(false);
            expect(this.inkaTheSpider.location).toBe('play area');
            this.player1.clickCard(this.inkaTheSpider);
            expect(this.inkaTheSpider.hasToken('damage')).toBe(false);
            expect(this.inkaTheSpider.location).toBe('play area');
            this.player1.clickCard(this.troll);
            expect(this.troll.hasToken('damage')).toBe(false);
            expect(this.troll.location).toBe('play area');
            this.player1.clickCard(this.mightyTiger);
            expect(this.mightyTiger.tokens.damage).toBe(1);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.troll.location).toBe('play area');
            expect(this.mightyTiger.location).toBe('play area');
            expect(this.inkaTheSpider.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
