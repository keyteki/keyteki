describe('Ria Bevy Gress', function () {
    describe("Ria Bevy Gress's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    amber: 0,
                    inPlay: ['ria-bevy-gress', 'caspart']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'bumpsy', 'urchin']
                }
            });
        });

        it('captures 1 per +1 power counter on friendlies when overwhelmed on reap', function () {
            this.caspart.tokens.power = 2;
            this.riaBevyGress.tokens.power = 1;
            this.player1.reap(this.riaBevyGress);
            // overwhelmed: 3 power counters -> capture 3
            expect(this.riaBevyGress.tokens.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures 1 when not overwhelmed', function () {
            this.player2.moveCard(this.bumpsy, 'discard');
            this.player2.moveCard(this.urchin, 'discard');
            this.player1.reap(this.riaBevyGress);
            expect(this.riaBevyGress.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures 0 when overwhelmed but no power counters', function () {
            this.player1.reap(this.riaBevyGress);
            expect(this.riaBevyGress.tokens.amber).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
