describe('Soul Fiddle', function () {
    describe("Soul Fiddle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['a-fair-game', 'arise'],
                    inPlay: ['soul-fiddle', 'dextre'],
                    discard: ['tocsin', 'batdrone']
                },
                player2: {
                    hand: ['snufflegator', 'inka-the-spider', 'sequis'],
                    inPlay: ['mighty-tiger'],
                    discard: ['flaxia', 'nexus']
                }
            });
        });
        it('should enrage a targeted enemy creature when used', function () {
            this.player1.clickCard(this.soulFiddle);
            this.player1.clickPrompt("Use this card's Action Ability");
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            this.player1.clickCard(this.mightyTiger);
            expect(this.mightyTiger.hasToken('enrage')).toBe(true);
        });
        it('should enrage a targeted friendly creature when used', function () {
            this.player1.clickCard(this.soulFiddle);
            this.player1.clickPrompt("Use this card's Action Ability");
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.hasToken('enrage')).toBe(true);
        });
        it("should fizzle if there's no creatures on the board", function () {
            this.player1.moveCard(this.dextre, 'discard');
            this.player2.moveCard(this.mightyTiger, 'discard');
            this.player1.clickCard(this.soulFiddle);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
