describe('Deepwood Druid', function () {
    describe("Deepwood Druid's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['silvertooth', 'rustgnawer', 'brain-eater'],
                    hand: ['deepwood-druid']
                },
                player2: {
                    inPlay: ['dextre', 'sequis', 'mother']
                }
            });
            this.silvertooth.addToken('damage');
            this.dextre.addToken('damage');
            this.sequis.addToken('damage');
            this.brainEater.addToken('damage', 2);
        });
        it('on play, it should allow full healing of a neighboring creature', function () {
            this.player1.playCreature(this.deepwoodDruid, true);
            expect(this.player1).toHavePrompt('Deepwood Druid');
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.brainEater);
            expect(this.player1).not.toBeAbleToSelect(this.rustgnawer);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.tokens.damage).toBe(undefined);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
    describe("Deepwood Druid's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['silvertooth', 'deepwood-druid', 'rustgnawer', 'brain-eater']
                },
                player2: {
                    inPlay: ['dextre', 'sequis', 'mother']
                }
            });
            this.silvertooth.addToken('damage');
            this.dextre.addToken('damage');
            this.rustgnawer.addToken('damage', 2);
            this.brainEater.addToken('damage', 2);
        });
        it('on reap, it should allow full healing of a neighboring creature', function () {
            this.player1.reap(this.deepwoodDruid);
            expect(this.player1).toHavePrompt('Deepwood Druid');
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.rustgnawer);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.brainEater);
            this.player1.clickCard(this.rustgnawer);
            expect(this.rustgnawer.tokens.damage).toBe(undefined);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
