describe('Clone Home', function () {
    describe("Clone Home's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    token: 'grumpus',
                    hand: ['clone-home', 'blypyp', 'zizok']
                },
                player2: {
                    inPlay: ['troll', 'groke']
                }
            });
        });

        it('should not archive if there are fewer friendly creatures', function () {
            this.player1.play(this.cloneHome);
            expect(this.cloneHome.location).toBe('discard');
        });
    });

    describe("Clone Home's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    token: 'grumpus',
                    hand: ['clone-home', 'blypyp', 'zizok']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not archive if there are equal friendly creatures', function () {
            this.player1.play(this.cloneHome);
            expect(this.cloneHome.location).toBe('discard');
        });

        it('should archive if the token makes more creatures', function () {
            this.player1.playCreature(this.blypyp, true);
            this.player1.play(this.cloneHome);
            this.player1.clickPrompt('Right');
            expect(this.cloneHome.location).toBe('archives');
        });

        it('should archive if there are more friendly creatures', function () {
            this.player1.playCreature(this.blypyp, true);
            this.player1.playCreature(this.zizok, true);
            this.player1.play(this.cloneHome);
            this.player1.clickPrompt('Right');
            expect(this.cloneHome.location).toBe('archives');
        });
    });
});
