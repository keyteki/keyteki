describe('Carpe Vinum', function () {
    describe("Carpe Vinum's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['carpe-vinum'],
                    inPlay: ['archimedes']
                },
                player2: {
                    inPlay: ['troll', 'redlock', 'bad-penny']
                }
            });

            this.player1.play(this.carpeVinum);
        });

        it('should be able to target enemy creatures', function () {
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
        });

        describe('and select two creatures', function () {
            beforeEach(function () {
                expect(this.player1).not.toHavePromptButton('Done');
                this.player1.clickCard(this.badPenny);
                expect(this.player1).not.toHavePromptButton('Done');
                this.player1.clickCard(this.redlock);
                this.player1.clickPrompt('Done');
            });

            it('should exalt them', function () {
                expect(this.badPenny.amber).toBe(1);
                expect(this.redlock.amber).toBe(1);
            });
        });
    });
});
