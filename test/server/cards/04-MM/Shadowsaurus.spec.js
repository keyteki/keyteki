describe('Shadowsaurus', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'shadows',
                hand: ['sic-semper-tyrannosaurus', 'brutodon-auxiliary'],
                inPlay: ['shadowsaurus']
            },
            player2: {
                inPlay: ['redlock', 'krump', 'senator-bracchus']
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
        this.redlock.amber = 10;
        this.krump.amber = 4;
        this.player1.useAction(this.shadowsaurus);

        expect(this.player1).toBeAbleToSelect(this.krump);
        this.player1.clickCard(this.krump);
        this.player1.clickPrompt('Left');

        expect(this.krump.controller).toBe(this.player1.player);
        expect(this.player2.amber).toBe(4);
    });

    it('should change controlled creatures to shadows', function () {
        expect(this.senatorBracchus.hasHouse('shadows')).toBe(false);
        expect(this.senatorBracchus.hasHouse('saurian')).toBe(true);
        this.senatorBracchus.amber = 10;
        this.player1.useAction(this.shadowsaurus);

        expect(this.player1).toBeAbleToSelect(this.senatorBracchus);
        this.player1.clickCard(this.senatorBracchus);
        this.player1.clickPrompt('Left');

        expect(this.senatorBracchus.controller).toBe(this.player1.player);
        expect(this.player2.amber).toBe(10);
        expect(this.senatorBracchus.hasHouse('shadows')).toBe(true);
        expect(this.senatorBracchus.hasHouse('saurian')).toBe(false);
    });
});
