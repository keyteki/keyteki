describe('Bomb-Arang', function () {
    describe("Bomb-Arang's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['bomb-arang'],
                    inPlay: ['hunting-witch']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'pelf']
                }
            });
        });

        it('should deal 3 damage to an enemy creature and 1 to a friendly creature if not destroyed', function () {
            this.player1.play(this.bombArang);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.huntingWitch);
            expect(this.huntingWitch.tokens.damage).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal 3 damage to an enemy creature and stop if destroyed', function () {
            this.player1.play(this.bombArang);
            this.player1.clickCard(this.pelf);
            expect(this.pelf.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not count wards as destruction', function () {
            this.pelf.ward();
            this.player1.play(this.bombArang);
            this.player1.clickCard(this.pelf);
            this.player1.clickCard(this.huntingWitch);
            expect(this.pelf.location).toBe('play area');
            expect(this.pelf.tokens.damage).toBe(undefined);
            expect(this.huntingWitch.tokens.damage).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
