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

        it('should flip all token creatures', function () {
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

        /**
         * Captured æmber only goes to the opponent’s pool if a _creature_
         * leaves play. In the case of non-creature tokens for Temporal Purge,
         * they should not be considered creatures at the moment they go to
         * the discard, so any tokens on them return to the supply.
         *
         * Regression test for https://github.com/keyteki/keyteki/issues/3957
         */
        it('should send Æmber on Action cards to the pool', function () {
            let anger = this.player2.inPlay[0];
            anger.tokens.amber = 3;

            expect(anger.name).toBe('Grumpus');

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);

            this.player1.play(this.temporalPurge);

            expect(anger.location).toBe('discard');

            // Player 1 should get an æmber because of Temporal Purge’s pip, but
            // the æmber captured on to the Anger-Grumpus should go to the
            // common supply.
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe('and persistent effects', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    token: 'trader',
                    amber: 1,
                    inPlay: ['trader:trimble', 'shĭsnyasĭ-buggy', 'pismire'],
                    hand: ['temporal-purge']
                },
                player2: {
                    amber: 1,
                    token: 'scholar',
                    inPlay: ['scholar:tentaclid', 'seabringer-kekoa']
                }
            });
        });

        it('should apply persistent effects after flip', function () {
            expect(this.scholar.name).toBe('Scholar');
            expect(this.trader.name).toBe('Trader');
            expect(this.pismire.hasKeyword('skirmish')).toBe(false);
            expect(this.trader.hasKeyword('skirmish')).toBe(false);
            expect(this.scholar.hasKeyword('skirmish')).toBe(false);
            expect(this.scholar.hasKeyword('taunt')).toBe(false);

            this.player1.play(this.temporalPurge);

            expect(this.scholar.name).toBe('Tentaclid');
            expect(this.trader.name).toBe('Trimble');
            expect(this.pismire.hasKeyword('skirmish')).toBe(true);
            expect(this.trader.hasKeyword('skirmish')).toBe(true);
            expect(this.scholar.hasKeyword('skirmish')).toBe(true);
            expect(this.scholar.hasKeyword('taunt')).toBe(true);
        });
    });
});
