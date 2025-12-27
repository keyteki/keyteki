describe('Came Back Wrong', function () {
    describe("Came Back Wrong's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['came-back-wrong'],
                    inPlay: ['umbra'],
                    discard: ['witch-of-the-eye', 'ganger-chieftain', 'dharna']
                },
                player2: {
                    inPlay: ['troll'],
                    discard: ['infurnace']
                }
            });
        });

        it('play creature from discard and attach itself', function () {
            this.player1.play(this.cameBackWrong);
            expect(this.player1).toBeAbleToSelect(this.witchOfTheEye);
            expect(this.player1).toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).toBeAbleToSelect(this.dharna);
            expect(this.player1).not.toBeAbleToSelect(this.infurnace);
            this.player1.clickCard(this.witchOfTheEye);
            this.player1.clickPrompt('Right');
            expect(this.witchOfTheEye.location).toBe('play area');
            expect(this.cameBackWrong.location).toBe('play area');
            expect(this.witchOfTheEye.upgrades).toContain(this.cameBackWrong);
            expect(this.witchOfTheEye.power).toBe(1);
            expect(this.cameBackWrong.type).toBe('upgrade');
        });

        it('play creature from discard and get play effect', function () {
            this.player1.play(this.cameBackWrong);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickPrompt('Right');
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
        });

        it('cannot play small creature from discard', function () {
            this.player1.play(this.cameBackWrong);
            this.player1.clickCard(this.dharna);
            this.player1.clickPrompt('Right');
            expect(this.dharna.location).toBe('discard');
            expect(this.cameBackWrong.location).toBe('discard');
            expect(this.dharna.upgrades).not.toContain(this.cameBackWrong);
        });

        /**
         * Regression test for https://github.com/keyteki/keyteki/issues/4371
         */
        it('can be used again after it kills a small creature', function () {
            this.player1.play(this.cameBackWrong);
            this.player1.clickCard(this.dharna);
            this.player1.clickPrompt('Right');
            expect(this.dharna.location).toBe('discard');
            expect(this.cameBackWrong.location).toBe('discard');
            expect(this.cameBackWrong.type).toBe('action');

            this.player1.moveCard(this.cameBackWrong, 'hand');

            this.player1.clickCard(this.cameBackWrong);
            expect(this.player1).toHavePrompt('Came Back Wrong');
            this.player1.clickPrompt('Play this action');

            expect(this.player1).toHavePrompt('Came Back Wrong');
            expect(this.player1).toBeAbleToSelect(this.witchOfTheEye);
            expect(this.player1).toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).toBeAbleToSelect(this.dharna);
            expect(this.player1).not.toBeAbleToSelect(this.infurnace);
            this.player1.clickCard(this.witchOfTheEye);
            this.player1.clickPrompt('Right');
            expect(this.witchOfTheEye.location).toBe('play area');
            expect(this.cameBackWrong.location).toBe('play area');
            expect(this.cameBackWrong.type).toBe('upgrade');
        });
    });
});
