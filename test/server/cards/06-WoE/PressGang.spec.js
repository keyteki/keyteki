describe('Press Gang', function () {
    describe("Press Gang's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'grumpus',
                    inPlay: ['bumpsy', 'pelf'],
                    hand: ['press-gang']
                },
                player2: {
                    inPlay: ['batdrone', 'troll'],
                    hand: ['hypnobeam']
                }
            });
        });

        it('should not archive if no enemy creatures have been destroyed', function () {
            this.player1.play(this.pressGang);
            this.player1.clickPrompt('Right');
            expect(this.pressGang.location).toBe('discard');
        });

        it('should archive if there was an enemy creature destroyed', function () {
            this.player1.fightWith(this.bumpsy, this.batdrone);
            this.player1.play(this.pressGang);
            this.player1.clickPrompt('Right');
            expect(this.pressGang.location).toBe('archives');
        });

        it('should archive if there the enemy creature destroyed was owned by you', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.pelf);
            this.player2.clickPrompt('Right');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');

            this.player1.fightWith(this.bumpsy, this.pelf);
            this.player1.play(this.pressGang);
            this.player1.clickPrompt('Right');
            expect(this.pressGang.location).toBe('archives');
        });
    });
});
