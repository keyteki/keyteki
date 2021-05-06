describe('AnkyloFormation test', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'saurian',
                hand: ['ankylo-formation'],
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
            this.player1.play(this.ankyloFormation);
        });

        it('should ask for options', function () {
            expect(this.player1).toHavePromptButton('Skirmish');
            expect(this.player1).toHavePromptButton('Exalt');
        });

        describe('and opt to skirmish', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Skirmish');
                this.player1.clickCard(this.titanMechanic);
            });

            it('should give skirmish', function () {
                expect(this.titanMechanic.amber).toBe(0);
                expect(this.titanMechanic.getKeywordValue('skirmish')).toBe(1);
                expect(this.helperBot.getKeywordValue('skirmish')).toBe(0);
                expect(this.troll.getKeywordValue('skirmish')).toBe(0);
                expect(this.badPenny.getKeywordValue('skirmish')).toBe(0);
            });
        });

        describe('and opt to exalt', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Exalt');
                this.player1.clickCard(this.titanMechanic);
            });

            it('should give skirmish', function () {
                expect(this.titanMechanic.amber).toBe(1);
                expect(this.titanMechanic.getKeywordValue('skirmish')).toBe(1);
                expect(this.helperBot.getKeywordValue('skirmish')).toBe(1);
                expect(this.troll.getKeywordValue('skirmish')).toBe(1);
                expect(this.badPenny.getKeywordValue('skirmish')).toBe(0);
            });
        });
    });
});
