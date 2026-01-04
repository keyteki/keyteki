describe('Incensed', function () {
    describe("Incensed's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['troll', 'looter-goblin'],
                    hand: ['incensed']
                },
                player2: {
                    amber: 1,
                    inPlay: ['flaxia']
                }
            });

            this.player1.play(this.incensed);
        });

        it('should allows creature to gain 1 on fight this turn', function () {
            this.player1.fightWith(this.troll, this.flaxia);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain 1 if creature dies during the fight', function () {
            this.player1.fightWith(this.looterGoblin, this.flaxia);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not work for opponent or on your next turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.flaxia, this.looterGoblin);
            expect(this.player2.amber).toBe(1);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.fightWith(this.troll, this.flaxia);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
