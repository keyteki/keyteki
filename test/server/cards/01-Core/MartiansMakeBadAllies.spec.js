describe('Martians Make Bad Allies', function () {
    describe("Martians Make Bad Allies' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: [
                        'martians-make-bad-allies',
                        'zorg',
                        'tunk',
                        'lamindra',
                        'dodger',
                        'keyforgery',
                        'anger'
                    ]
                },
                player2: {}
            });
        });

        it('should purge non-Mars creatures from hand and gain amber', function () {
            this.player1.play(this.martiansMakeBadAllies);
            expect(this.zorg.location).toBe('hand');
            expect(this.tunk.location).toBe('hand');
            expect(this.lamindra.location).toBe('purged');
            expect(this.dodger.location).toBe('purged');
            expect(this.keyforgery.location).toBe('hand');
            expect(this.anger.location).toBe('hand');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain no amber if no non-Mars creatures in hand', function () {
            this.player1.moveCard(this.lamindra, 'discard');
            this.player1.moveCard(this.dodger, 'discard');
            this.player1.play(this.martiansMakeBadAllies);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
