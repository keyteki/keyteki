describe('Janky Jimmy', function () {
    describe('When player is overwhelmed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['janky-jimmy']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'bumpsy']
                }
            });
        });

        it('makes an enemy creature capture 1 from its own side after fight', function () {
            expect(this.player1.player.isOverwhelmed()).toBe(true);
            this.player1.fightWith(this.jankyJimmy, this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.jankyJimmy);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('When player is not overwhelmed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['janky-jimmy', 'echofly']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra']
                }
            });
        });

        it('Janky Jimmy captures 1', function () {
            expect(this.player1.player.isOverwhelmed()).toBe(false);
            this.player1.fightWith(this.jankyJimmy, this.lamindra);
            expect(this.jankyJimmy.amber).toBe(1);
            expect(this.echofly.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
