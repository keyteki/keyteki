describe('Imperial Scutum', function () {
    describe("Imperial Scutum' attached ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['questor-jarta'],
                    hand: ['imperial-scutum']
                },
                player2: {
                    amber: 1,
                    inPlay: ['groke', 'grovekeeper']
                }
            });
        });

        it('should increase armor', function () {
            this.player1.playUpgrade(this.imperialScutum, this.questorJarta);
            expect(this.questorJarta.tokens.armor).toBe(2);
            this.player1.fightWith(this.questorJarta, this.grovekeeper);
            expect(this.questorJarta.hasToken('armor')).toBe(false);
            expect(this.questorJarta.tokens.damage).toBe(1);
        });

        it('should not move captured amber to opponent', function () {
            this.questorJarta.tokens.amber = 5;
            this.player1.playUpgrade(this.imperialScutum, this.questorJarta);
            this.player1.fightWith(this.questorJarta, this.groke);

            expect(this.questorJarta.location).toBe('discard');
            expect(this.player2.amber).toBe(1);
        });
    });
});
