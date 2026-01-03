describe('Nectarcyte', function () {
    describe("Nectarcyte's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['nectarcyte', 'ember-imp', 'krump']
                },
                player2: {
                    inPlay: ['troll', 'urchin']
                }
            });
        });

        it('should add 3 power counters after fighting', function () {
            this.player1.fightWith(this.nectarcyte, this.urchin);
            expect(this.nectarcyte.power).toBe(8);
            this.player1.selectOption(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should add 3 power counters after reaping', function () {
            this.player1.reap(this.nectarcyte);
            expect(this.nectarcyte.power).toBe(8);
            this.player1.selectOption(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow moving power counters to another friendly creature', function () {
            this.player1.fightWith(this.nectarcyte, this.urchin);
            expect(this.player1).toHavePrompt('Choose a number');
            expect(this.player1).toHavePromptButton(0);
            expect(this.player1).toHavePromptButton(1);
            expect(this.player1).toHavePromptButton(2);
            expect(this.player1).toHavePromptButton(3);
            expect(this.player1).not.toHavePromptButton(4);
            this.player1.selectOption(1);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.nectarcyte);
            this.player1.clickCard(this.emberImp);
            this.expectReadyToTakeAction(this.player1);
            expect(this.nectarcyte.power).toBe(7);
            expect(this.emberImp.power).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
