describe('Charitable Herald', function () {
    describe("Charitable Herald's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['charitable-herald'],
                    inPlay: ['ember-imp', 'yurk']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'searine']
                }
            });
        });

        it('should ward a creature when played', function () {
            this.player1.playCreature(this.charitableHerald);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.yurk);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.searine);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.warded).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should ward a creature after reaping', function () {
            this.player1.moveCard(this.charitableHerald, 'play area');
            this.charitableHerald.exhausted = false;
            this.player1.reap(this.charitableHerald);
            this.player1.clickCard(this.yurk);
            expect(this.yurk.warded).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should remove all wards from friendly creatures when fate is triggered', function () {
            this.emberImp.tokens.ward = 1;
            this.flaxia.tokens.ward = 1;
            this.player1.activateProphecy(this.overreach, this.charitableHerald);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            expect(this.emberImp.warded).toBe(true);
            expect(this.flaxia.warded).toBe(false);
            expect(this.charitableHerald.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
