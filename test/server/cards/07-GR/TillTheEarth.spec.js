describe('Till the Earth', function () {
    describe("Till the Earth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['till-the-earth'],
                    inPlay: ['sabira-the-medium'],
                    discard: ['timetraveller', 'poke']
                },
                player2: {
                    amber: 1,
                    discard: ['flaxia']
                }
            });
        });

        it('shuffles both players discards into their deck', function () {
            this.player1.play(this.tillTheEarth);
            expect(this.poke.location).toBe('deck');
            expect(this.player1.player.deck).toContain(this.poke);
            expect(this.timetraveller.location).toBe('deck');
            expect(this.player1.player.deck).toContain(this.timetraveller);
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player1.player.discard).toContain(this.tillTheEarth);
            expect(this.flaxia.location).toBe('deck');
            expect(this.player2.player.discard.length).toBe(0);
            expect(this.player2.player.deck).toContain(this.flaxia);
            expect(this.player1.amber).toBe(4);
        });
    });
});
