describe('Hoplites Dory', function () {
    describe("Hoplites Dory's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['hoplite-s-dory', 'questor-jarta', 'brutodon-auxiliary'],
                    inPlay: ['aquilia-lone-hero', 'orator-hissaro']
                },
                player2: {
                    inPlay: ['umbra', 'murkens']
                }
            });

            this.hopliteSDory = this.player1.hand[0];
        });

        it('gives +2 power for each exhausted creature to the left', function () {
            this.player1.playUpgrade(this.hopliteSDory, this.oratorHissaro);
            expect(this.oratorHissaro.power).toBe(3);
            this.player1.reap(this.aquiliaLoneHero);
            expect(this.oratorHissaro.power).toBe(5);
            this.player1.reap(this.oratorHissaro);
            expect(this.oratorHissaro.power).toBe(5);
            this.player1.playCreature(this.questorJarta, true);
            expect(this.oratorHissaro.power).toBe(7);
            this.player1.playCreature(this.brutodonAuxiliary);
            expect(this.oratorHissaro.power).toBe(7);
        });

        it('gives +2 power to enemy creatures asll', function () {
            this.player1.playUpgrade(this.hopliteSDory, this.murkens);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.murkens.power).toBe(2);
            this.player2.reap(this.umbra);
            expect(this.murkens.power).toBe(4);
        });
    });
});
