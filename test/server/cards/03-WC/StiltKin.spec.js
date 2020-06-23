describe('stilt-kin(WC)', function () {
    describe('stilt-kin ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['stilt-kin'],
                    hand: ['cowfyne', 'little-rapscal']
                },
                player2: {
                    inPlay: ['looter-goblin', 'nexus', 'troll']
                }
            });
        });

        it('should ready and fights when giant is played adjacent', function () {
            this.player1.reap(this.stiltKin);
            this.player1.play(this.cowfyne);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.stiltKin.hasToken('damage')).toBe(false);
        });

        it('should not ready and fights when non-giant is played adjacent', function () {
            this.player1.reap(this.stiltKin);
            this.player1.play(this.littleRapscal);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
