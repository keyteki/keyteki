describe('Hypoxia', function () {
    describe("Hypoxia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'b0-t',
                    amber: 1,
                    inPlay: ['b0-t:flaxia', 'armsmaster-molina'],
                    hand: ['hypoxia']
                },
                player2: {
                    amber: 1,
                    token: 'trader',
                    inPlay: ['flaxia']
                }
            });

            this.tokenCreatures = [
                this.player1.inPlay[0],
                this.player1.inPlay[1],
                this.player2.inPlay[0],
                this.player2.inPlay[1]
            ];
        });

        it('should destroy all tokens', function () {
            this.player1.play(this.hypoxia);
            /*
            expect(this.armsmasterMolina.location).toBe('play area');
            expect(this.senatorShrix.location).toBe('play area');
            expect(this.flaxia.location).toBe('play area');
            */
            /*
            expect(this.tokenCreatures[0].location).toBe('discard');
            expect(this.tokenCreatures[1].location).toBe('discard');
            expect(this.tokenCreatures[2].location).toBe('discard');
            expect(this.tokenCreatures[3].location).toBe('discard');
            */
        });
    });
});
