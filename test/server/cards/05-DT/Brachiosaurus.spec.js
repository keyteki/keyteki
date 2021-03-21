describe('Brachiosaurus', function () {
    describe('When played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['brachiosaurus'],
                    inPlay: ['helper-bot', 'titan-mechanic', 'bad-penny', 'urchin']
                }
            });
            this.helperBot.tokens.amber = 4;
            this.badPenny.tokens.amber = 1;
            this.urchin.tokens.amber = 1;
        });

        describe('next to two creatures', function () {
            beforeEach(function () {
                this.player1.playCreature(this.brachiosaurus, true, true);
                this.player1.clickCard(this.titanMechanic);
            });

            it('should stun neighbors and remove amber from them', function () {
                expect(this.helperBot.stunned).toBe(true);
                expect(this.titanMechanic.stunned).toBe(true);
                expect(this.badPenny.stunned).toBe(false);
                expect(this.urchin.stunned).toBe(false);

                expect(this.helperBot.amber).toBe(3);
                expect(this.titanMechanic.amber).toBe(0);
                expect(this.badPenny.amber).toBe(1);
                expect(this.urchin.amber).toBe(1);
            });
        });
    });
});
