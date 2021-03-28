describe('Hyde', function () {
    describe("Hyde's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['hyde'],
                    hand: ['velum', 'dextre', 'dextre', 'dextre', 'troll', 'krump']
                },
                player2: {
                    inPlay: ['groggins']
                }
            });
        });

        it('Should draw 1 card when Velum is not in play', function () {
            this.player1.reap(this.hyde);
            expect(this.player1.amber).toBe(1);

            expect(this.player1.hand.length).toBe(7);
        });

        it('Should draw 2 cards when Velum is in play', function () {
            this.player1.playCreature(this.velum);
            this.player1.reap(this.hyde);
            expect(this.player1.amber).toBe(1);

            expect(this.player1.hand.length).toBe(7);
        });
    });

    describe("Hyde's destroy ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['hyde'],
                    hand: ['velum', 'dextre', 'dextre', 'dextre', 'troll', 'krump']
                },
                player2: {
                    inPlay: ['groggins']
                }
            });
        });

        it('Should destroy Hyde since Velum is in hand', function () {
            this.player1.fightWith(this.hyde, this.groggins);

            expect(this.hyde.location).toBe('discard');
            expect(this.velum.location).toBe('hand');
        });

        it('Should destroy Hyde since Velum is in play', function () {
            this.player1.playCreature(this.velum);
            this.player1.fightWith(this.hyde, this.groggins);

            expect(this.hyde.location).toBe('discard');
            expect(this.velum.location).toBe('play area');
        });

        it('Should archive Hyde and Velum', function () {
            this.player1.moveCard(this.velum, 'discard');
            expect(this.velum.location).toBe('discard');

            this.player1.fightWith(this.hyde, this.groggins);

            expect(this.hyde.location).toBe('archives');
            expect(this.velum.location).toBe('archives');
        });
    });
});
