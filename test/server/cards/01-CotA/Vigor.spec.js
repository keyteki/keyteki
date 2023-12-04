describe('Vigor', function () {
    describe("Vigor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['mighty-tiger'],
                    hand: ['vigor']
                },
                player2: {
                    inPlay: ['dust-pixie', 'dextre', 'zorg']
                }
            });
        });

        it('should gain an amber even if no targets need healing', function () {
            this.player1.play(this.vigor);
            expect(this.player1.amber).toBe(1);
            this.player1.clickCard(this.mightyTiger);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should gain an amber if healing is less than 1', function () {
            this.player1.fightWith(this.mightyTiger, this.dustPixie);
            expect(this.mightyTiger.tokens.damage).toBe(1);
            this.player1.play(this.vigor);
            this.player1.clickCard(this.mightyTiger);
            this.player1.clickPrompt('1');
            expect(this.mightyTiger.hasToken('damage')).toBe(false);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should gain 2 amber when healing 3 damage', function () {
            this.player1.fightWith(this.mightyTiger, this.dextre);
            expect(this.mightyTiger.tokens.damage).toBe(3);
            this.player1.play(this.vigor);
            this.player1.clickCard(this.mightyTiger);
            this.player1.clickPrompt('3');
            expect(this.mightyTiger.hasToken('damage')).toBe(false);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
