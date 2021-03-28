describe('Creed of Nurture', function () {
    describe("Creed of Nurture's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 0,
                    hand: ['eldest-bear', 'snufflegator'],
                    inPlay: ['firespitter', 'creed-of-nurture']
                },
                player2: {
                    inPlay: ['briar-grubbling', 'troll']
                }
            });
        });

        it('should sacrifice Creed of Nurture, and prompt the player to choose two creatures', function () {
            this.player1.clickCard(this.creedOfNurture);
            expect(this.player1).toHavePrompt('Creed of Nurture');
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.creedOfNurture.location).toBe('discard');
            expect(this.player1).toHavePrompt('Creed of Nurture');
            expect(this.player1).toBeAbleToSelect(this.eldestBear);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            expect(this.player1).not.toBeAbleToSelect(this.firespitter);
            expect(this.player1).not.toBeAbleToSelect(this.briarGrubbling);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.eldestBear);
            expect(this.player1).toHavePrompt('Creed of Nurture');
            expect(this.player1).not.toBeAbleToSelect(this.eldestBear);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            expect(this.player1).toBeAbleToSelect(this.firespitter);
            expect(this.player1).toBeAbleToSelect(this.briarGrubbling);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.firespitter);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.firespitter.hasTrait('witch')).toBe(true);
            expect(this.firespitter.getKeywordValue('assault')).toBe(3);
        });

        it('should resolve printed and gained before fight abilities correctly', function () {
            this.player1.clickCard(this.creedOfNurture);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.clickCard(this.eldestBear);
            this.player1.clickCard(this.firespitter);
            this.player1.fightWith(this.firespitter, this.briarGrubbling);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.briarGrubbling);
            expect(this.player1).toBeAbleToSelect(this.firespitter);
            this.player1.clickCard(this.firespitter);
            expect(this.player1).toHavePrompt('Which ability would you like to use?');
            this.player1.clickPrompt('Creed of Nurture');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.briarGrubbling);
            expect(this.player1).toBeAbleToSelect(this.firespitter);
            this.player1.clickCard(this.firespitter);
            expect(this.player1).toHavePrompt('Which ability would you like to use?');
            this.player1.clickPrompt('Firespitter');
            expect(this.briarGrubbling.tokens.damage).toBe(1);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.briarGrubbling);
            expect(this.player1).toBeAbleToSelect(this.firespitter);
            this.player1.clickCard(this.briarGrubbling);
            expect(this.firespitter.tokens.damage).toBe(4);
            expect(this.briarGrubbling.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
