describe('Saucer 149', function () {
    describe("Saucer 149's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    hand: ['saucer-149']
                },
                player2: {
                    inPlay: ['dust-pixie', 'troll']
                }
            });
        });

        it('should exalt 4 times on play', function () {
            this.player1.playCreature(this.saucer149);
            expect(this.saucer149.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should move 2 amber as an action', function () {
            this.player1.playCreature(this.saucer149);
            this.saucer149.ready();
            this.player1.useAction(this.saucer149);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.saucer149);
            this.player1.clickCard(this.dustPixie);
            expect(this.saucer149.amber).toBe(2);
            expect(this.dustPixie.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should move 1 amber if there is only 1', function () {
            this.player1.playCreature(this.saucer149);
            this.saucer149.ready();
            this.saucer149.amber = 1;
            this.player1.useAction(this.saucer149);
            this.player1.clickCard(this.dustPixie);
            expect(this.saucer149.amber).toBe(0);
            expect(this.dustPixie.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
