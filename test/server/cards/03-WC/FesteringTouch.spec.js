describe('Festering Touch', function () {
    describe('its ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['troll', 'dextre'],
                    hand: ['festering-touch', 'tremor']
                },
                player2: {
                    inPlay: ['troll', 'bulwark', 'sequis']
                }
            });
        });

        it('deal 1 damage to a creature that is undamaged', function () {
            this.player1.play(this.festeringTouch);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');

            expect(this.troll.tokens.damage).toBe(1);
        });

        it('deal 3 damage to a creature that is damaged', function () {
            this.troll.tokens.damage = 1;
            this.player1.play(this.festeringTouch);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');

            expect(this.troll.tokens.damage).toBe(4);
        });
    });
});
