describe('Wild Spirit', function () {
    describe('card ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 3,
                    hand: ['wild-spirit'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 3,
                    inPlay: ['dexus', 'brain-eater']
                }
            });
        });

        it('should give the creature capture 1A after reap', function () {
            this.player1.playUpgrade(this.wildSpirit, this.flaxia);
            this.player1.reap(this.flaxia);
            expect(this.flaxia.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });
    });
});
