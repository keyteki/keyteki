describe('Enchanted Murmook', function () {
    describe("Enchanted Murmook's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 6,
                    inPlay: ['eunoia', 'enchanted-murmook', 'umbra'],
                    hand: ['dew-faerie']
                },
                player2: {
                    amber: 9,
                    inPlay: ['krump', 'troll']
                }
            });
        });

        it('should increase opponent key cost by 1 for 1 untamed neighbor', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.amber).toBe(2);
            this.player2.clickPrompt('brobnar');
        });

        it('should increase opponent key cost by 2 for 2 untamed neighbors', function () {
            this.player1.moveCard(this.umbra, 'discard');
            this.player1.playCreature(this.dewFaerie);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.amber).toBe(1);
            this.player2.clickPrompt('brobnar');
        });

        it('should not affect own key cost', function () {
            this.player2.amber = 0;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(0);
            this.player1.clickPrompt('untamed');
        });
    });
});
