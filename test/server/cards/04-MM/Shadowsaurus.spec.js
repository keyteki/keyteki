describe('Shadowsaurus', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'shadows',
                hand: ['sic-semper-tyrannosaurus', 'brutodon-auxiliary'],
                inPlay: ['shadowsaurus']
            },
            player2: {
                inPlay: ['redlock', 'krump']
            }
        });
    });

    it('give no amber to the opponent and not take control of the creature if there is no amber on it', function () {
        this.player1.useAction(this.shadowsaurus);
        expect(this.player1).toBeAbleToSelect(this.krump);

        this.player1.clickCard(this.krump);
        expect(this.player2.amber).toBe(0);
        expect(this.krump.controller).toBe(this.player2.player);
    });

    it('give the amber on a creature to the opponent and take control of it', function () {
        this.redlock.tokens.amber = 10;
        this.krump.tokens.amber = 4;
        this.player1.useAction(this.shadowsaurus);

        expect(this.player1).toBeAbleToSelect(this.krump);
        this.player1.clickCard(this.krump);

        expect(this.krump.controller).toBe(this.player1.player);
        expect(this.player2.amber).toBe(4);
    });
});
