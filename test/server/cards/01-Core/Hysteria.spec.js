describe('Hysteria', function () {
    describe("Hysteria's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['hysteria'],
                    inPlay: ['ember-imp', 'shooler']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should return all creatures to their owners hands', function () {
            this.krump.tokens.ward = 1;
            this.player1.play(this.hysteria);
            expect(this.emberImp.location).toBe('hand');
            expect(this.shooler.location).toBe('hand');
            expect(this.troll.location).toBe('hand');
            expect(this.krump.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
