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
            expect(this.player1).toHavePrompt('Select first card to return (last one is top)');
            this.player1.clickPrompt('Autocannon');
            expect(this.troll.location).toBe('play area');
            expect(this.autocannon.location).toBe('deck');
            expect(this.cannon.location).toBe('deck');
            expect(this.mother.location).toBe('play area');
            expect(this.lifeward.location).toBe('deck');
            expect(this.player2.deck[0]).toBe(this.lifeward);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let the active player choose the order of artifacts on top of a deck', function () {
            this.player1.play(this.barehanded);
            this.player1.clickPrompt('Autocannon');
            expect(this.player1.deck[0]).toBe(this.cannon);
            expect(this.player1.deck[1]).toBe(this.autocannon);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow the reverse order', function () {
            this.player1.play(this.barehanded);
            this.player1.clickPrompt('Cannon');
            expect(this.player1.deck[0]).toBe(this.autocannon);
            expect(this.player1.deck[1]).toBe(this.cannon);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
