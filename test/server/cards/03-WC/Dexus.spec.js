describe('Dexus', function () {
    describe('card ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 3,
                    hand: ['dust-imp', 'beasts--bane', 'lash-of-broken-dreams'],
                    discard: ['niffle-ape'],
                    inPlay: ['lifeward', 'grabber-jammer', 'gebuk', 'lifeward']
                },
                player2: {
                    inPlay: ['dexus', 'brain-eater']
                }
            });
        });

        it('should cause the opponent to lose an amber when a right flank creature is played', function () {
            this.player1.play(this.dustImp);
            expect(this.player1.amber).toBe(2);
        });

        it('should not cause the opponent to lose an amber put into play on right flank', function () {
            this.player1.moveCard(this.niffleApe, 'deck');
            this.player1.play(this.beastsBane);
            this.player1.clickCard(this.gebuk);
            expect(this.niffleApe.location).toBe('play area');
            expect(this.gebuk.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
        });

        it('should not cause the opponent to lose an amber when a left flank creature is played', function () {
            this.player1.play(this.dustImp, true);
            expect(this.player1.amber).toBe(3);
        });

        it('should not cause the opponent to lose an amber when an artifact is played', function () {
            this.player1.play(this.lashOfBrokenDreams);
            expect(this.player1.amber).toBe(3);
        });
    });

    describe('card ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 3,
                    hand: ['dust-imp'],
                    inPlay: ['lifeward', 'lifeward']
                },
                player2: {
                    inPlay: ['dexus', 'brain-eater']
                }
            });
        });

        it('should cause the opponent to lose an amber when a single creature in play', function () {
            this.player1.play(this.dustImp);
            expect(this.player1.amber).toBe(2);
        });
    });
});
