describe('Janky Jimmy', function () {
    describe('When player is overwhelmed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['janky-jimmy']
                },
                player2: {
                    inPlay: [
                        'lamindra',
                        'bumpsy',
                        'krump',
                        'helichopper',
                        'troll',
                        'shadys',
                        'echofly'
                    ]
                }
            });
        });

        it('makes an enemy creature capture 1 from its own side after fight', function () {
            expect(this.player1.player.isOverwhelmed()).toBe(true);
            this.player2.amber = 2;
            this.player1.fightWith(this.jankyJimmy, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.jankyJimmy);
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
                    inPlay: ['janky-jimmy', 'echofly', 'shadys', 'paranormal-palisade']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('a friendly creature captures 1', function () {
            expect(this.player1.player.isOverwhelmed()).toBe(false);
            this.player2.amber = 2;
            this.player1.fightWith(this.jankyJimmy, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.shadys);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
