describe('Creed of Nature', function () {
    describe("Creed of Nature's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['creed-of-nature', 'mighty-tiger', 'duskwitch'],
                    hand: ['low-dawn', 'dew-faerie']
                },
                player2: {
                    inPlay: ['snufflegator', 'grabber-jammer']
                }
            });
        });
        it('should give a creature skirmish and assault <x> where <x> is the creatures power before sacrificing itself.', function () {
            this.player1.clickCard(this.creedOfNature);
            this.player1.clickPrompt("Use this card's Omni Ability");
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.duskwitch);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            expect(this.player1).toBeAbleToSelect(this.grabberJammer);
            this.player1.clickCard(this.mightyTiger);
            expect(this.mightyTiger.getKeywordValue('assault')).toBe(4);
            this.player1.fightWith(this.mightyTiger, this.grabberJammer);
            expect(this.grabberJammer.location).toBe('discard');
            expect(this.mightyTiger.tokens.damage).toBe(undefined);
            expect(this.creedOfNature.location).toBe('discard');
        });
    });
});
