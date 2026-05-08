describe('Benny', function () {
    describe("Benny's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['benny', 'blypyp', 'iyxrenu-the-clever', 'number-612'],
                    hand: ['bartos-the-ruiner']
                },
                player2: {
                    inPlay: ['troll', 'dust-pixie']
                }
            });
        });

        it('should ready each other Martian creature after reaping', function () {
            this.blypyp.exhaust();
            this.iyxrenuTheClever.exhaust();
            this.number612.exhaust();
            this.player1.reap(this.benny);
            expect(this.blypyp.exhausted).toBe(false);
            expect(this.iyxrenuTheClever.exhausted).toBe(false);
            expect(this.number612.exhausted).toBe(true);
            expect(this.benny.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should purge itself when destroyed if no other friendly Mars creatures', function () {
            this.player1.moveCard(this.blypyp, 'discard');
            this.player1.moveCard(this.iyxrenuTheClever, 'discard');
            this.player1.moveCard(this.number612, 'discard');
            this.player1.fightWith(this.benny, this.troll);
            expect(this.benny.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not purge itself when destroyed if there are other friendly Mars creatures', function () {
            this.player1.moveCard(this.blypyp, 'discard');
            this.player1.moveCard(this.iyxrenuTheClever, 'discard');
            this.player1.fightWith(this.benny, this.troll);
            expect(this.benny.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
