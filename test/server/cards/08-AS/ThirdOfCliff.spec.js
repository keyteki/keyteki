describe('Third of Cliff', function () {
    describe("Third of Cliff's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    inPlay: ['flaxia', 'third-of-cliff']
                },
                player2: {
                    inPlay: ['troll', 'groke', 'krump']
                }
            });
        });

        it('destroy one enemy flank creatures if no red key', function () {
            this.player1.useAction(this.thirdOfCliff);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.groke);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.thirdOfCliff);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('destroy all enemy flank creatures if red key', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.useAction(this.thirdOfCliff);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.groke.location).toBe('play area');
            expect(this.flaxia.location).toBe('play area');
            expect(this.thirdOfCliff.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
