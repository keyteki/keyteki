describe('Grabber Jammer', function () {
    describe("Grabber Jammer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['grabber-jammer']
                },
                player2: {
                    amber: 6,
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should increase opponent key cost by 1', function () {
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            this.player1.endTurn();
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2).toHavePrompt('Choose which house you want to activate this turn');
        });

        it('should capture 1 amber on fight', function () {
            this.player1.fightWith(this.grabberJammer, this.emberImp);
            expect(this.grabberJammer.amber).toBe(1);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should capture 1 amber on reap', function () {
            this.player1.reap(this.grabberJammer);
            expect(this.grabberJammer.amber).toBe(1);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
