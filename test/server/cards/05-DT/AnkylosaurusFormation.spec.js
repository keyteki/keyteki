describe('AnkylosaurusFormation test', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'saurian',
                hand: ['ankylosaurus-formation'],
                inPlay: ['helper-bot', 'titan-mechanic', 'troll']
            },
            player2: {
                inPlay: ['bad-penny'],
                amber: 2
            }
        });
    });

    describe('when played', function () {
        beforeEach(function () {
            this.player1.play(this.ankylosaurusFormation);
            this.player1.clickCard(this.titanMechanic);
        });

        it('should give skirmish', function () {
            expect(this.titanMechanic.getKeywordValue('skirmish')).toBe(1);
            expect(this.helperBot.getKeywordValue('skirmish')).toBe(0);
            expect(this.troll.getKeywordValue('skirmish')).toBe(0);
            expect(this.badPenny.getKeywordValue('skirmish')).toBe(0);
            expect(this.player1).toHavePrompt('Do you wish to exalt this creature?');
        });

        describe('exalts creature', function () {
            beforeEach(function () {
                this.player1.clickPrompt('yes');
            });

            it('should give skirmish', function () {
                expect(this.titanMechanic.getKeywordValue('skirmish')).toBe(2);
                expect(this.helperBot.getKeywordValue('skirmish')).toBe(1);
                expect(this.troll.getKeywordValue('skirmish')).toBe(1);
                expect(this.badPenny.getKeywordValue('skirmish')).toBe(0);
            });
        });

        describe('do not exalt creature', function () {
            beforeEach(function () {
                this.player1.clickPrompt('no');
            });

            it('should give skirmish', function () {
                expect(this.titanMechanic.getKeywordValue('skirmish')).toBe(1);
                expect(this.helperBot.getKeywordValue('skirmish')).toBe(0);
                expect(this.troll.getKeywordValue('skirmish')).toBe(0);
                expect(this.badPenny.getKeywordValue('skirmish')).toBe(0);
            });
        });
    });
});
