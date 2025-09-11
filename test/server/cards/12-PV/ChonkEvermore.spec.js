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
        });

        it('should give two creatures a power counter and double all power counters', function () {
            this.troll.tokens.power = 2;
            this.player1.play(this.chonkEvermore);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.emberImp.tokens.power).toBe(2);
            expect(this.krump.tokens.power).toBe(2);
            expect(this.troll.tokens.power).toBe(4);
            expect(this.cpoZytar.tokens.power).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should give each enemy creature two power counters when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.chonkEvermore);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.emberImp.tokens.power).toBe(2);
            expect(this.troll.tokens.power).toBe(2);
            expect(this.krump.tokens.power).toBeUndefined();
            expect(this.cpoZytar.tokens.power).toBeUndefined();
            expect(this.chonkEvermore.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
