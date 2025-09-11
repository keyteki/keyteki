describe('Mogg', function () {
    describe("Mogg's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['mogg'],
                    inPlay: ['ember-imp', 'troll']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'urchin', 'pelf']
                }
            });

            this.pelf.tokens.power = 2;
        });

        it('should deal 4 damage to each creature with power 5 or higher when played', function () {
            this.player1.playCreature(this.mogg);
            expect(this.krump.tokens.damage).toBe(4);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.pelf.tokens.damage).toBe(4);
            expect(this.urchin.location).toBe('play area');
            expect(this.urchin.tokens.damage).toBeUndefined();
            expect(this.mogg.location).toBe('play area');
            expect(this.mogg.tokens.damage).toBeUndefined();
            expect(this.emberImp.location).toBe('play area');
            expect(this.emberImp.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should stun each friendly creature with power 5 or higher when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.mogg);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.krump.stunned).toBe(true);
            expect(this.pelf.stunned).toBe(true);
            expect(this.urchin.stunned).toBe(false);
            expect(this.emberImp.stunned).toBe(false);
            expect(this.troll.stunned).toBe(false);
            expect(this.mogg.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
