describe('Fifalde', function () {
    describe("Fifalde's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['fifalde', 'bombyx', 'chenille']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should not be destroyed if played and is able to destroy a bombyx', function () {
            this.player1.play(this.chenille);
            this.player1.play(this.bombyx);
            this.player1.clickCard(this.chenille);
            expect(this.chenille.location).toBe('discard');

            this.player1.play(this.fifalde);
            this.player1.clickCard(this.bombyx);
            expect(this.bombyx.location).toBe('discard');

            this.player1.endTurn();
            expect(this.fifalde.location).toBe('play area');
        });

        it('should be destroyed if played when there are no ceatures', function () {
            this.player1.play(this.fifalde);
            this.player1.endTurn();
            expect(this.fifalde.location).toBe('discard');
        });

        it('should heal and gain 1 AE when it reaps', function () {
            this.player1.moveCard(this.fifalde, 'play area');
            this.fifalde.addToken('damage', 2);
            expect(this.fifalde.damage).toBe(2);
            expect(this.player2.amber).toBe(1);
            this.player1.reap(this.fifalde);
            expect(this.player1.amber).toBe(3);
            expect(this.fifalde.damage).toBe(0);
        });
    });
});
