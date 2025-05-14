describe('Treok, The Wise', function () {
    describe("Treok, The Wise's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['treok-the-wise', 'troll']
                },
                player2: {
                    inPlay: ['urchin', 'dust-pixie', 'hunting-witch']
                }
            });
        });

        it('should give a creature invulnerable until the start of your next turn', function () {
            this.player1.reap(this.treokTheWise);
            expect(this.player1).toBeAbleToSelect(this.treokTheWise);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.troll);

            // Try to damage the protected creature
            this.player1.fightWith(this.troll, this.dustPixie);
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.dustPixie.location).toBe('discard');

            // End turn and check that invulnerable is still there
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.urchin, this.troll);
            expect(this.troll.tokens.damage).toBeUndefined();
            this.player2.endTurn();

            // Now invulnerable should be gone.
            this.player1.clickPrompt('brobnar');
            this.player1.fightWith(this.troll, this.huntingWitch);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.huntingWitch.location).toBe('discard');
        });
    });
});
