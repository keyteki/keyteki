describe('Deep Priest Glebe', function () {
    describe('Deep Priest Glebe ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['portalmonger', 'portalmonger', 'tentaclid'],
                    inPlay: ['deep-priest-glebe']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump'],
                    hand: ['portalmonger', 'troll']
                }
            });
            this.aquan1 = this.player1.hand[0];
            this.aquan2 = this.player1.hand[1];
            this.aquan3 = this.player2.hand[0];
        });

        it('should not trigger on opponents aquan creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.play(this.aquan3);
            expect(this.player2).not.toBeAbleToSelect(this.gub);
            expect(this.player2).not.toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.deepPriestGlebe);
            expect(this.player2).not.toBeAbleToSelect(this.aquan3);
            expect(this.player2).not.toBeAbleToSelect(this.deepPriestGlebe);

            expect(this.gub.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            expect(this.deepPriestGlebe.exhausted).toBe(false);
        });

        it('should not trigger on nonaquan creature', function () {
            this.player1.play(this.tentaclid);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.deepPriestGlebe);

            expect(this.gub.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            expect(this.deepPriestGlebe.exhausted).toBe(false);
        });

        it('select an enemy creature on playing aquan', function () {
            this.player1.play(this.aquan1);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.deepPriestGlebe);

            this.player1.clickCard(this.gub);
            expect(this.gub.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(false);
            expect(this.deepPriestGlebe.exhausted).toBe(false);
            this.player1.play(this.aquan2);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.deepPriestGlebe);

            this.player1.clickCard(this.krump);
            expect(this.gub.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.deepPriestGlebe.exhausted).toBe(false);
        });
    });
});
