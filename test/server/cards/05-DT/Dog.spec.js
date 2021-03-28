describe('Dog', function () {
    describe("Dog's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 1,
                    hand: ['mighty-lance'],
                    inPlay: ['scrivener-favian', 'dog', 'q-mechs', 'opal-knight']
                },
                player2: {
                    amber: 1,
                    inPlay: ['drummernaut', 'stilt-kin'],
                    hand: ['poke']
                }
            });
        });

        it('should NOT ready dog if non neighbor fights and is damaged', function () {
            this.player1.amber = 1;
            expect(this.dog.exhausted).toBe(false);
            this.player1.reap(this.dog);
            expect(this.dog.exhausted).toBe(true);

            this.player1.fightWith(this.opalKnight, this.drummernaut);
            expect(this.opalKnight.location).toBe('discard');
            expect(this.dog.exhausted).toBe(true);
            this.player1.endTurn();
        });

        it('should ready dog if left neighbor fights and is damaged and dies', function () {
            this.player1.amber = 1;
            expect(this.dog.exhausted).toBe(false);
            this.player1.reap(this.dog);
            expect(this.dog.exhausted).toBe(true);

            this.player1.fightWith(this.scrivenerFavian, this.drummernaut);
            expect(this.scrivenerFavian.location).toBe('discard');
            expect(this.dog.exhausted).toBe(false);

            this.player1.reap(this.dog);
            expect(this.dog.exhausted).toBe(true);
            expect(this.player1.amber).toBe(3);
            this.player1.endTurn();
        });

        it('should ready dog if left neighbor fights and is damaged and lives', function () {
            this.player1.amber = 1;
            expect(this.dog.exhausted).toBe(false);
            this.player1.reap(this.dog);

            expect(this.dog.exhausted).toBe(true);
            this.player1.fightWith(this.scrivenerFavian, this.stiltKin);
            expect(this.stiltKin.location).toBe('discard');
            expect(this.scrivenerFavian.location).toBe('play area');
            expect(this.scrivenerFavian.tokens.damage).toBe(2);

            expect(this.dog.exhausted).toBe(false);
            this.player1.reap(this.dog);
            expect(this.dog.exhausted).toBe(true);
            expect(this.player1.amber).toBe(3);
            this.player1.endTurn();
        });

        it('should ready dog right creature is damaged by opponent', function () {
            this.player1.endTurn();

            this.dog.exhausted = true;
            this.player2.clickPrompt('logos');

            expect(this.dog.exhausted).toBe(true);
            this.player2.play(this.poke);
            this.player2.clickCard(this.scrivenerFavian);
            expect(this.dog.exhausted).toBe(false);
            this.player2.endTurn();
        });
    });
});
