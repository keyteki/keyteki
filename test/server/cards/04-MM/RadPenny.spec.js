describe('Rad Penny', function () {
    describe("Rad Penny's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['rad-penny']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('steals 1A on play', function () {
            this.player1.play(this.radPenny);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Rad Penny's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['rad-penny']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('shuffles into deck when destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.radPenny);
            expect(this.radPenny.location).toBe('deck');
        });
    });
});
