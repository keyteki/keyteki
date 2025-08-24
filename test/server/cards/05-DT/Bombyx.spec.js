describe('Bombyx', function () {
    describe('Bombyx', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['dust-pixie', 'fifalde', 'chenille', 'bombyx']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should not be destroyed if played and is able to destroy a chenille', function () {
            this.player1.play(this.chenille);
            this.player1.play(this.bombyx);
            this.player1.clickCard(this.chenille);
            this.player1.endTurn();
            expect(this.bombyx.location).toBe('play area');
            expect(this.chenille.location).toBe('discard');
        });

        it('should be destroyed if played when there are no ceatures', function () {
            this.player1.play(this.bombyx);
            this.player1.endTurn();
            expect(this.bombyx.location).toBe('discard');
        });

        it('should do nothing when there is no fifalde in the discard', function () {
            this.player1.moveCard(this.bombyx, 'play area');
            this.player1.moveCard(this.dustPixie, 'discard');
            expect(this.dustPixie.location).toBe('discard');
            this.player1.useAction(this.bombyx);
            this.player1.endTurn();
            expect(this.dustPixie.location).toBe('discard');
        });

        it('should pick up fifalde from discard pile', function () {
            this.player1.moveCard(this.bombyx, 'play area');
            this.player1.moveCard(this.fifalde, 'discard');
            expect(this.fifalde.location).toBe('discard');
            this.player1.useAction(this.bombyx);
            this.player1.clickCard(this.fifalde);
            this.player1.endTurn();
            expect(this.fifalde.location).toBe('hand');
        });
    });
});
