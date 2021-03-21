describe('Butterfly', function () {
    describe("Butterfly's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['butterfly', 'cocoon', 'larva']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should not be destroyed if played and is able to destroy a cocoon', function () {
            this.player1.play(this.larva);
            this.player1.play(this.cocoon);
            this.player1.clickCard(this.larva);
            expect(this.larva.location).toBe('discard');

            this.player1.play(this.butterfly);
            this.player1.clickCard(this.cocoon);
            expect(this.cocoon.location).toBe('discard');

            this.player1.endTurn();
            expect(this.butterfly.location).toBe('play area');
        });

        it('should be destroyed if played when there are no ceatures', function () {
            this.player1.play(this.butterfly);
            this.player1.endTurn();
            expect(this.butterfly.location).toBe('discard');
        });

        it('should heal and gain 1 AE when it reaps', function () {
            this.player1.moveCard(this.butterfly, 'play area');
            this.butterfly.addToken('damage', 2);
            expect(this.butterfly.tokens.damage).toBe(2);
            expect(this.player2.amber).toBe(1);
            this.player1.reap(this.butterfly);
            expect(this.player1.amber).toBe(3);
            expect(this.butterfly.tokens.damage).toBeUndefined();
        });
    });
});
