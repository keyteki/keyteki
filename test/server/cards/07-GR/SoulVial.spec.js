describe('Soul Vial', function () {
    describe("Soul Vial's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    inPlay: ['echofly', 'miss-chievous', 'flaxia', 'soul-vial']
                },
                player2: {
                    amber: 1,
                    hand: ['coward-s-end'],
                    inPlay: ['thing-from-the-deep', 'dust-pixie']
                }
            });
        });

        it('archives friendly creatures with amber on them on destroy', function () {
            this.echofly.amber = 1;
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.echofly.location).toBe('archives');
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('does not archive creatures without amber on them on destroy', function () {
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.echofly.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('does not archive creatures with amber on them on destroy', function () {
            this.dustPixie.amber = 1;
            this.player1.fightWith(this.echofly, this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
