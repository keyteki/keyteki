describe('Ransack', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'shadows',
                hand: ['ransack', 'twin-bolt-emission'],
                inPlay: ['nexus', 'gorm-of-omm', 'library-of-babble'],
                discard: ['dextre', 'urchin', 'umbra']
            },
            player2: {
                amber: 3,
                inPlay: ['batdrone', 'ember-imp']
            }
        });
    });

    it('should trigger when played', function () {
        this.player1.moveCard(this.dextre, 'deck');
        this.player1.play(this.ransack);

        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(2);
    });

    it('should resolve the ability again if the top card is shadows', function () {
        this.player1.moveCard(this.dextre, 'deck');
        this.player1.moveCard(this.urchin, 'deck');

        this.player1.play(this.ransack);

        expect(this.player1.amber).toBe(2);
        expect(this.player2.amber).toBe(1);
    });
});
