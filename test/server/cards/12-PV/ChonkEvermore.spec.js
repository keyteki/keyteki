describe('Chonk Evermore', function () {
    describe("Chonk Evermore's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 2,
                    hand: ['chonk-evermore'],
                    inPlay: ['ember-imp', 'troll'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'cpo-zytar']
                }
            });
            this.cpoZytar.tokens.power = 3;
        });

        it('should allow declining to give power counters', function () {
            this.player1.play(this.chonkEvermore);
            expect(this.player1).toHavePrompt('Chonk Evermore');
            this.player1.clickPrompt('Continue');
            expect(this.emberImp.tokens.power).toBe(undefined);
            expect(this.troll.tokens.power).toBe(undefined);
            expect(this.krump.tokens.power).toBe(undefined);
            expect(this.cpoZytar.tokens.power).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should give two creatures a power counter and double all power counters', function () {
            this.player1.play(this.chonkEvermore);
            expect(this.player1).toHavePrompt('Chonk Evermore');
            this.player1.clickPrompt('Power counters');
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.emberImp.tokens.power).toBe(2);
            expect(this.krump.tokens.power).toBe(2);
            expect(this.troll.tokens.power).toBe(undefined);
            expect(this.cpoZytar.tokens.power).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should only allow selecting exactly 2 creatures', function () {
            this.player1.play(this.chonkEvermore);
            expect(this.player1).toHavePrompt('Chonk Evermore');
            this.player1.clickPrompt('Power counters');
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.emberImp);
            expect(this.player1).toHavePrompt('Chonk Evermore');
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.cpoZytar); // trying to select a third creature should do nothing
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.emberImp.tokens.power).toBe(2);
            expect(this.troll.tokens.power).toBe(undefined);
            expect(this.krump.tokens.power).toBe(2);
            expect(this.cpoZytar.tokens.power).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should give each enemy creature two power counters when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.chonkEvermore);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.emberImp.tokens.power).toBe(2);
            expect(this.troll.tokens.power).toBe(2);
            expect(this.krump.tokens.power).toBe(undefined);
            expect(this.cpoZytar.tokens.power).toBe(3);
            expect(this.chonkEvermore.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
