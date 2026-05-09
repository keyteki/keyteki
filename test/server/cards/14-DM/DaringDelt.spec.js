describe('Daring Delt', function () {
    describe("Daring Delt's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['daring-delt', 'caspart', 'noxious-ionox']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('gains 1 amber per ready friendly creature of active house after fight', function () {
            const before = this.player1.amber;
            this.player1.fightWith(this.daringDelt, this.urchin);
            // ready friendly ouboros creatures (excluding daring delt itself which is now exhausted from fight)
            // caspart and noxious-ionox = 2 ready ouboros
            expect(this.player1.amber).toBe(before + 2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not count exhausted friendly creatures', function () {
            this.caspart.exhaust();
            this.noxiousIonox.exhaust();
            const before = this.player1.amber;
            this.player1.fightWith(this.daringDelt, this.urchin);
            expect(this.player1.amber).toBe(before);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
