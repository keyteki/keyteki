describe('Barehanded', function () {
    describe("Barehanded's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['barehanded'],
                    inPlay: ['troll', 'autocannon', 'cannon']
                },
                player2: {
                    inPlay: ['hunting-witch', 'mother', 'lifeward']
                }
            });
        });

        it('should put all artifacts on top of their owners decks', function () {
            this.player1.play(this.barehanded);
            expect(this.troll.location).toBe('play area');
            expect(this.autocannon.location).toBe('deck');
            expect(this.cannon.location).toBe('deck');
            expect(this.mother.location).toBe('play area');
            expect(this.lifeward.location).toBe('deck');
            expect(this.player2.deck[0]).toBe(this.lifeward);
        });
    });
});
