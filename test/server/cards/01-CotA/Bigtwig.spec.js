describe('Bigtwig', function () {
    describe("Bigtwig's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['bigtwig'],
                    hand: ['inka-the-spider']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not allow him to attack unstunned targets', function () {
            this.player1.clickCard(this.bigtwig);
            expect(this.player1).toHavePrompt('Bigtwig');
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
        });

        it('should allow him to attack stunned targets', function () {
            this.player1.play(this.inkaTheSpider);
            this.player1.clickCard(this.troll);
            expect(this.troll.stunned).toBe(true);
            this.player1.clickCard(this.bigtwig);
            expect(this.player1).toHavePrompt('Bigtwig');
            expect(this.player1).toHavePromptButton('Fight with this creature');
        });

        it('should stun a creature when he reaps', function () {
            this.player1.reap(this.bigtwig);
            expect(this.player1).toHavePrompt('Bigtwig');
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.stunned).toBe(true);
        });
    });
});
