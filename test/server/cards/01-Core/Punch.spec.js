describe('Punch', function () {
    describe("Punch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['punch'],
                    inPlay: ['bumpsy']
                },
                player2: {
                    inPlay: ['sequis']
                }
            });
        });

        it('should deal 3 damage to a creature', function () {
            this.player1.play(this.punch);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.sequis);
            expect(this.sequis.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to target friendly creatures', function () {
            this.player1.play(this.punch);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
