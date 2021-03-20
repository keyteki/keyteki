describe('Infighting', function () {
    describe("Infighting's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['infighting', 'the-common-cold'],
                    inPlay: ['nexus', 'urchin']
                },
                player2: {
                    inPlay: ['mother', 'zorg', 'batdrone']
                }
            });
        });

        it('should cause each creature to deal their power in damage to the creature on its right', function () {
            this.player1.play(this.infighting);
            // should be dead since it takes damage from nexus
            expect(this.urchin.location).toBe('discard');

            // should be un harmed since was on urchin's left
            expect(this.nexus.location).toBe('play area');
            expect(this.nexus.tokens.damage).toBeUndefined();

            // should be dead because batrone is on zorg's right
            expect(this.batdrone.location).toBe('discard');

            // should take 5 damage from mother, because zorg is on mother's right
            expect(this.zorg.location).toBe('play area');
            expect(this.zorg.tokens.damage).toBe(5);

            // should be alive, with no damage
            expect(this.mother.tokens.damage).toBeUndefined();
            expect(this.mother.location).toBe('play area');
        });

        it('should not harm a creature which is alone', function () {
            this.player1.play(this.theCommonCold);
            this.player1.clickPrompt('No');
            expect(this.urchin.location).toBe('discard');
            expect(this.nexus.tokens.damage).toBe(1);

            this.player1.play(this.infighting);
            expect(this.nexus.location).toBe('play area');
            expect(this.nexus.tokens.damage).toBe(1);
        });
    });
});
