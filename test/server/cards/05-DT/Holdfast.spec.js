describe('Holdfast', function () {
    describe("Holdfast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 1,
                    hand: ['mighty-lance'],
                    inPlay: ['scrivener-favian', 'holdfast', 'q-mechs', 'opal-knight']
                },
                player2: {
                    amber: 1,
                    inPlay: ['drummernaut', 'stilt-kin', 'urchin', 'shoulder-id'],
                    hand: ['poke']
                }
            });
        });

        it('should NOT ready holdfast if non neighbor fights and is damaged', function () {
            this.player1.amber = 1;
            expect(this.holdfast.exhausted).toBe(false);
            this.player1.reap(this.holdfast);
            expect(this.holdfast.exhausted).toBe(true);

            this.player1.fightWith(this.opalKnight, this.drummernaut);
            expect(this.opalKnight.location).toBe('discard');
            expect(this.holdfast.exhausted).toBe(true);
            this.player1.endTurn();
        });

        it('should ready holdfast if left neighbor fights and is damaged and dies', function () {
            this.player1.amber = 1;
            expect(this.holdfast.exhausted).toBe(false);
            this.player1.reap(this.holdfast);
            expect(this.holdfast.exhausted).toBe(true);

            this.player1.fightWith(this.scrivenerFavian, this.drummernaut);
            expect(this.scrivenerFavian.location).toBe('discard');
            expect(this.holdfast.exhausted).toBe(false);

            this.player1.reap(this.holdfast);
            expect(this.holdfast.exhausted).toBe(true);
            expect(this.player1.amber).toBe(3);
            this.player1.endTurn();
        });

        it('should ready holdfast if left neighbor fights and is damaged and lives', function () {
            this.player1.amber = 1;
            expect(this.holdfast.exhausted).toBe(false);
            this.player1.reap(this.holdfast);

            expect(this.holdfast.exhausted).toBe(true);
            this.player1.fightWith(this.scrivenerFavian, this.stiltKin);
            expect(this.stiltKin.location).toBe('discard');
            expect(this.scrivenerFavian.location).toBe('play area');
            expect(this.scrivenerFavian.damage).toBe(2);

            expect(this.holdfast.exhausted).toBe(false);
            this.player1.reap(this.holdfast);
            expect(this.holdfast.exhausted).toBe(true);
            expect(this.player1.amber).toBe(3);
            this.player1.endTurn();
        });

        it('should ready holdfast right creature is damaged by opponent', function () {
            this.player1.endTurn();

            this.holdfast.exhausted = true;
            this.player2.clickPrompt('logos');

            expect(this.holdfast.exhausted).toBe(true);
            this.player2.play(this.poke);
            this.player2.clickCard(this.qMechs);
            expect(this.holdfast.exhausted).toBe(false);
            this.player2.endTurn();
        });

        it('should NOT ready holdfast if damage is not taken by Shoulder Id', function () {
            expect(this.holdfast.exhausted).toBe(false);
            this.player1.reap(this.holdfast);
            expect(this.holdfast.exhausted).toBe(true);

            this.player1.fightWith(this.opalKnight, this.shoulderId);
            expect(this.holdfast.exhausted).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });
    });
});
