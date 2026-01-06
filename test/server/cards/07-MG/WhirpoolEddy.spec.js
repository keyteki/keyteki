describe('Whirpool Eddy', function () {
    describe("Whirpool Eddy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    inPlay: ['whirpool-eddy', 'krump', 'bumpsy', 'alaka']
                },
                player2: {
                    inPlay: ['troll', 'brammo', 'badger']
                }
            });
        });

        it('stuns and exhausts a creature that is not already stunned', function () {
            this.krump.tokens.stun = 1;
            this.bumpsy.exhausted = true;
            this.troll.tokens.stun = 1;
            this.brammo.exhausted = true;
            this.player1.clickCard(this.whirpoolEddy);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Whirpool Eddy');
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.brammo);
            expect(this.player1).toBeAbleToSelect(this.badger);
            this.player1.clickCard(this.alaka);
            expect(this.alaka.stunned).toBe(true);
            expect(this.alaka.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
