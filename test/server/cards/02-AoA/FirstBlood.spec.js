describe('First Blood', function () {
    describe("First Blood's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['first-blood', 'forgemaster-og'],
                    inPlay: ['bumpsy', 'bingle-bangbang', 'ancient-bear']
                }
            });
        });
        it('should allow you to deal 2 damage for each friendly brobnar creature, distributed 1 at a time.', function () {
            this.player1.play(this.firstBlood);
            expect(this.player1).toHavePrompt('First Blood');
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.bingleBangbang);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.bingleBangbang);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            expect(this.bingleBangbang.tokens.damage).toBe(1);
            expect(this.bumpsy.tokens.damage).toBe(3);
            expect(this.firstBlood.location).toBe('discard');
        });
    });
    describe("First Blood's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['first-blood', 'forgemaster-og'],
                    inPlay: ['ancient-bear']
                }
            });
        });
        it('should do nothing if there are no friendly brobnar creatures in play.', function () {
            this.player1.play(this.firstBlood);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Play Phase');
            expect(this.player1).toHavePromptButton('End Turn');
        });
    });
});
