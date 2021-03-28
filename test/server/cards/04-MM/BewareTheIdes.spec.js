describe('Beware the Ides', function () {
    describe("Beware the Ides's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: [
                        'beware-the-ides',
                        'galeatops',
                        'deusillus',
                        'deusillus2',
                        'terrordactyl'
                    ]
                },
                player2: {
                    inPlay: ['troll', 'lamindra']
                }
            });
        });

        it('should not prompt for any card if no card is in center of battleline', function () {
            this.player1.play(this.bewareTheIdes);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow selecting a friendly card in center of battle line', function () {
            this.player1.play(this.galeatops);
            this.player1.play(this.deusillus);
            this.player1.clickCard(this.troll);
            this.player1.play(this.terrordactyl);
            this.player1.play(this.bewareTheIdes);

            this.deusillus.tokens.power = 4;

            expect(this.player1).toBeAbleToSelect(this.deusillus);
            expect(this.player1).not.toBeAbleToSelect(this.galeatops);
            expect(this.player1).not.toBeAbleToSelect(this.terrordactyl);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.deusillus);
            expect(this.deusillus.tokens.damage).toBe(23);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow selecting an enemy card in center of battle line', function () {
            this.player2.moveCard(this.lamindra, 'discard');
            this.player1.play(this.galeatops);
            this.player1.play(this.bewareTheIdes);
            expect(this.player1).toBeAbleToSelect(this.galeatops);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
