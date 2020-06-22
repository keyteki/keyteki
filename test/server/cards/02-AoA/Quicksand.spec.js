describe('Quicksand', function () {
    describe("Quicksand's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['troll', 'mighty-tiger', 'snufflegator'],
                    hand: ['quicksand']
                },
                player2: {
                    inPlay: ['commander-remiel', 'dextre', 'inka-the-spider']
                }
            });
        });

        it('should destroy both players creatures where neither playert has an exhausted untamed creature', function () {
            this.player1.fightWith(this.snufflegator, this.dextre);
            this.player1.fightWith(this.mightyTiger, this.inkaTheSpider);
            expect(this.inkaTheSpider.location).toBe('discard');
            expect(this.dextre.location).toBe('deck');
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.snufflegator.location).toBe('play area');
            this.player1.play(this.quicksand);
            expect(this.player1).toHavePrompt('Quicksand');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            expect(this.player1).not.toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            this.player1.clickCard(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            this.player1.clickCard(this.commanderRemiel);
            expect(this.troll.location).toBe('discard');
            expect(this.commanderRemiel.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt the player where two creatures are tied', function () {
            this.player1.fightWith(this.mightyTiger, this.inkaTheSpider);
            expect(this.inkaTheSpider.location).toBe('discard');
            expect(this.mightyTiger.location).toBe('discard');
            this.player1.play(this.quicksand);
            expect(this.player1).toHavePrompt('Quicksand');
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            this.player1.clickCard(this.commanderRemiel);
            expect(this.commanderRemiel.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy the most powerful creature where only one player has an exhausted untamed creature', function () {
            this.player1.reap(this.mightyTiger);
            this.player1.reap(this.snufflegator);
            this.player1.play(this.quicksand);
            expect(this.player1).toHavePrompt('Quicksand');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            expect(this.player1).not.toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not resolve if both players have a ready untamed creature', function () {
            this.player1.play(this.quicksand);
            expect(this.troll.location).toBe('play area');
            expect(this.mightyTiger.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.commanderRemiel.location).toBe('play area');
            expect(this.dextre.location).toBe('play area');
            expect(this.inkaTheSpider.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
