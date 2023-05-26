describe('Temporal Purge', function () {
    describe("Temporal Purge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    token: 'scholar',
                    amber: 1,
                    inPlay: [
                        'stealthster',
                        'scholar:helper-bot',
                        'senator-shrix',
                        'scholar:foggify'
                    ],
                    hand: ['temporal-purge']
                },
                player2: {
                    amber: 1,
                    token: 'grumpus',
                    inPlay: ['grumpus:anger', 'gub', 'grumpus:malison'],
                    hand: ['groke']
                }
            });
        });

        it('should draw a card after reap', function () {
            let p1c0 = this.player1.inPlay[0];
            let p1c1 = this.player1.inPlay[1];
            let p1c2 = this.player1.inPlay[2];
            let p1c3 = this.player1.inPlay[3];

            let p2c0 = this.player2.inPlay[0];
            let p2c1 = this.player2.inPlay[1];
            let p2c2 = this.player2.inPlay[2];

            expect(p1c0.name).toBe('Stealthster');
            expect(p1c1.name).toBe('Scholar');
            expect(p1c2.name).toBe('Senator Shrix');
            expect(p1c3.name).toBe('Scholar');

            expect(p2c0.name).toBe('Grumpus');
            expect(p2c1.name).toBe('Gub');
            expect(p2c2.name).toBe('Grumpus');

            this.player1.play(this.temporalPurge);

            expect(p1c0.name).toBe('Stealthster');
            expect(p1c0.location).toBe('play area');
            expect(p1c1.name).toBe('Helper Bot');
            expect(p1c1.location).toBe('play area');
            expect(p1c2.name).toBe('Senator Shrix');
            expect(p1c2.location).toBe('play area');
            expect(p1c3.name).toBe('Foggify');
            expect(p1c3.location).toBe('discard');

            expect(p2c0.name).toBe('Anger');
            expect(p2c0.location).toBe('discard');
            expect(p2c1.name).toBe('Gub');
            expect(p2c1.location).toBe('play area');
            expect(p2c2.name).toBe('Malison');
            expect(p2c2.location).toBe('play area');
        });
    });
});
