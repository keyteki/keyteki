describe('Prime Authority', function () {
    describe("Prime Authority's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['prime-authority'],
                    inPlay: ['caspart', 'noxious-ionox']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('exhausts a creature; gains 2 if more friendly exhausted', function () {
            this.caspart.exhaust();
            const before = this.player1.amber;
            this.player1.play(this.primeAuthority);
            this.player1.clickPrompt('Exhaust a creature');
            this.player1.clickCard(this.noxiousIonox);
            // 2 friendly exhausted vs 0 enemy exhausted
            expect(this.player1.amber).toBe(before + 2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('readies a creature; no amber if not more exhausted', function () {
            this.caspart.exhaust();
            const before = this.player1.amber;
            this.player1.play(this.primeAuthority);
            this.player1.clickPrompt('Ready a creature');
            this.player1.clickCard(this.caspart);
            expect(this.caspart.exhausted).toBe(false);
            // 0 friendly vs 0 enemy exhausted - no amber gain
            expect(this.player1.amber).toBe(before);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
