describe('Dino-Beast', function () {
    describe("Dino-Beast's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['dino-beast']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('does not deal 3D if not exalted', function () {
            this.player1.play(this.dinoBeast);
            this.player1.clickPrompt('Done');
            expect(this.dinoBeast.amber).toBe(0);
            expect(this.troll.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 3D if exalted', function () {
            this.player1.play(this.dinoBeast);
            this.player1.clickCard(this.dinoBeast);
            this.player1.clickCard(this.troll);
            expect(this.dinoBeast.amber).toBe(1);
            expect(this.troll.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
