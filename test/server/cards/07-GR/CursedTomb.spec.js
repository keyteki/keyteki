describe('Cursed Tomb', function () {
    describe("Cursed Tomb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    inPlay: ['echofly', 'miss-chievous', 'flaxia', 'cursed-tomb']
                },
                player2: {
                    amber: 1,
                    hand: ['coward-s-end'],
                    inPlay: ['thing-from-the-deep', 'dust-pixie']
                }
            });
        });

        it('purges friendly creatures without amber on them on destroy', function () {
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.echofly.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not purge creatures with amber on them on destroy', function () {
            this.echofly.amber = 1;
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.echofly.location).toBe('discard');
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('purges enemy creatures without amber on them on destroy', function () {
            this.player1.fightWith(this.echofly, this.dustPixie);
            expect(this.dustPixie.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not purge creatures with amber on them on destroy', function () {
            this.dustPixie.amber = 1;
            this.player1.fightWith(this.echofly, this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('purges itself when there are no creatures in play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.cowardSEnd);
            this.player2.clickPrompt('Autoresolve');
            expect(this.player1.player.purged.length).toBe(4);
            expect(this.player2.player.purged.length).toBe(2);
            expect(this.cursedTomb.location).toBe('purged');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
