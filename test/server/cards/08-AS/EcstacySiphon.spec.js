describe('Ecstacy Siphon', function () {
    describe("Ecstacy Siphon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['ecstacy-siphon'],
                    inPlay: ['shooler']
                },
                player2: {
                    hand: ['dew-faerie', 'dust-pixie', 'ancient-bear'],
                    inPlay: ['troll', 'duskwitch']
                }
            });
        });

        it('deal one damage for each card in opponent hand', function () {
            this.player1.play(this.ecstacySiphon);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.duskwitch);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.duskwitch);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.duskwitch.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
