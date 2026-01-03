describe('Senator', function () {
    describe("Senator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'senator',
                    amber: 1,
                    inPlay: ['senator:bad-penny', 'faust-the-great']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll'],
                    hand: ['poltergeist']
                }
            });
        });

        it('should increase key cost when Faust The Great is not in discard', function () {
            let senator1 = this.player1.inPlay[0];
            expect(senator1.isToken()).toBe(true);
            this.player1.useAction(senator1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
        });
    });
});
