describe('Greedy Reprisal', function () {
    describe("Greedy Reprisal's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['greedy-reprisal'],
                    inPlay: ['ember-imp', 'raiding-knight', 'almsmaster']
                },
                player2: {
                    amber: 3,
                    inPlay: ['krump', 'flaxia', 'searine']
                }
            });
        });

        it('should destroy a creature for each amber in opponent pool', function () {
            this.player1.play(this.greedyReprisal);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.searine);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.almsmaster);
            this.player1.clickCard(this.krump);
            expect(this.player1).not.toHavePrompt('Done');
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePrompt('Done');
            this.player1.clickCard(this.searine);
            this.player1.clickPrompt('Done');
            expect(this.krump.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.searine.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deal 2 damage to a friendly creature for each point of armor on enemy creatures', function () {
            this.player1.activateProphecy(this.overreach, this.greedyReprisal);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player2).toBeAbleToSelect(this.krump);
            expect(this.player2).toBeAbleToSelect(this.flaxia);
            expect(this.player2).toBeAbleToSelect(this.searine);
            expect(this.player2).not.toBeAbleToSelect(this.emberImp);
            expect(this.player2).not.toBeAbleToSelect(this.raidingKnight);
            expect(this.player2).not.toBeAbleToSelect(this.almsmaster);
            this.player2.clickCard(this.krump);
            this.player2.clickCard(this.flaxia);
            this.player2.clickCard(this.searine);
            expect(this.krump.tokens.damage).toBe(2);
            expect(this.flaxia.tokens.damage).toBe(2);
            expect(this.searine.tokens.damage).toBe(2);
            expect(this.greedyReprisal.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
