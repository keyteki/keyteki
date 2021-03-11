describe('Ransack', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'shadows',
                hand: ['ransack', 'twin-bolt-emission'],
                inPlay: ['nexus', 'gorm-of-omm', 'library-of-babble'],
                discard: [
                    'dextre',
                    'urchin',
                    'umbra',
                    'lamindra',
                    'shadow-self',
                    'miasma',
                    'miasma-bomb'
                ]
            },
            player2: {
                amber: 3,
                inPlay: ['batdrone', 'ember-imp']
            }
        });
    });

    it('should discard even if no stealing happen', function () {
        this.player2.amber = 0;
        this.player1.moveCard(this.dextre, 'deck');
        this.player1.play(this.ransack);

        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(0);

        expect(this.dextre.location).toBe('discard');
    });

    it('should steal 1 and stop if deck is empty', function () {
        this.player1.player.deck = [];
        this.player1.play(this.ransack);

        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(2);

        expect(this.player1.player.discard.length).toBe(8);
    });

    it('should not steal and stop if deck is empty', function () {
        this.player2.amber = 0;
        this.player1.player.deck = [];
        this.player1.play(this.ransack);

        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(0);

        expect(this.player1.player.discard.length).toBe(8);
    });

    it('should steal and stop if top card is not shadows', function () {
        this.player1.moveCard(this.dextre, 'deck');
        this.player1.play(this.ransack);

        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(2);

        expect(this.dextre.location).toBe('discard');
    });

    it('should resolve the ability again if the top card is shadows', function () {
        this.player1.moveCard(this.dextre, 'deck');
        this.player1.moveCard(this.urchin, 'deck');

        this.player1.play(this.ransack);

        expect(this.player1.amber).toBe(2);
        expect(this.player2.amber).toBe(1);

        expect(this.urchin.location).toBe('discard');
        expect(this.dextre.location).toBe('discard');
    });

    it('should resolve the ability multiple times, even though opponent has no more amber to steal', function () {
        this.player1.moveCard(this.dextre, 'deck');
        this.player1.moveCard(this.lamindra, 'deck');
        this.player1.moveCard(this.shadowSelf, 'deck');
        this.player1.moveCard(this.miasma, 'deck');
        this.player1.moveCard(this.miasmaBomb, 'deck');
        this.player1.moveCard(this.urchin, 'deck');

        this.player1.play(this.ransack);

        expect(this.player1.amber).toBe(3);
        expect(this.player2.amber).toBe(0);

        expect(this.urchin.location).toBe('discard');
        expect(this.miasmaBomb.location).toBe('discard');
        expect(this.miasma.location).toBe('discard');
        expect(this.shadowSelf.location).toBe('discard');
        expect(this.lamindra.location).toBe('discard');
        expect(this.dextre.location).toBe('discard');
    });
});
