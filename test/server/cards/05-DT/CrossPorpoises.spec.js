describe('Cross Porpoises', function () {
    describe("Cross Porpoises' abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'untamed',
                    inPlay: ['armsmaster-molina'],
                    hand: ['cross-porpoises']
                },
                player2: {
                    amber: 3,
                    inPlay: ['murkens', 'lamindra', 'troll']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.crossPorpoises);
            });

            it('should enrage two enemy creatures and raise the tide', function () {
                expect(this.player1).toBeAbleToSelect(this.murkens);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.armsmasterMolina);
                expect(this.player1).not.toHavePromptButton('Done');

                this.player1.clickCard(this.murkens);
                expect(this.player1).not.toHavePromptButton('Done');

                this.player1.clickCard(this.lamindra);
                expect(this.player1).toHavePromptButton('Done');

                this.player1.clickPrompt('Done');
                expect(this.lamindra.enraged).toBe(true);
                expect(this.murkens.enraged).toBe(true);
                expect(this.troll.enraged).toBe(false);
                expect(this.armsmasterMolina.enraged).toBe(false);

                expect(this.player1.isTideHigh()).toBe(true);
            });
        });
    });
});
