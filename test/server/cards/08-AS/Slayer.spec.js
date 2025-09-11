describe('Slayer', function () {
    describe("Slayer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['slayer']
                },
                player2: {
                    inPlay: ['duskwitch', 'hunting-witch', 'dust-pixie']
                }
            });

            this.player1.playCreature(this.slayer);
            this.slayer.exhausted = false;
        });

        it('should have splash-attack and skirmish', function () {
            this.player1.fightWith(this.slayer, this.dustPixie);
            expect(this.slayer.tokens.damage).toBe(undefined);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be destroyed when there are no opponent creatures', function () {
            this.player1.fightWith(this.slayer, this.huntingWitch);
            expect(this.slayer.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
