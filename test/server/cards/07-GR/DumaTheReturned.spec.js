describe('Duma the Returned', function () {
    describe("Duma the Returned's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'sanctum',
                    hand: ['call-to-action'],
                    inPlay: ['duma-the-returned'],
                    discard: ['flaxia', 'hunting-witch', 'full-moon'].concat(
                        new Array(9).fill('poke')
                    )
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('puts the top 3 discard cards back in your hand', function () {
            this.player1.fightWith(this.dumaTheReturned, this.troll);
            expect(this.flaxia.location).toBe('hand');
            expect(this.huntingWitch.location).toBe('hand');
            expect(this.fullMoon.location).toBe('hand');
            expect(this.player1.player.discard.length).toBe(10);
            this.expectReadyToTakeAction(this.player1);
        });

        it('does not archive on destroy if not haunted', function () {
            this.player1.fightWith(this.dumaTheReturned, this.troll);
            expect(this.dumaTheReturned.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('archives on destroy if haunted', function () {
            this.player1.play(this.callToAction);
            this.player1.fightWith(this.dumaTheReturned, this.troll);
            expect(this.dumaTheReturned.location).toBe('archives');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
