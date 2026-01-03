describe('Katha the Wise', function () {
    describe("Katha the Wise's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['katha-the-wise'],
                    hand: ['fuzzy-gruen', 'eunoia', 'charette', 'helper-bot', 'lost-in-the-woods']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should allow playing an Untamed creature when using Omni', function () {
            this.player1.useAction(this.kathaTheWise, true);
            this.player1.playCreature(this.fuzzyGruen);
            expect(this.fuzzyGruen.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not allow playing non-Untamed creatures', function () {
            this.player1.useAction(this.kathaTheWise, true);
            this.expectReadyToTakeAction(this.player1);
            this.player1.clickCard(this.helperBot);
            this.expectReadyToTakeAction(this.player1);
            this.player1.clickCard(this.lostInTheWoods);
            this.expectReadyToTakeAction(this.player1);
            this.player1.playCreature(this.eunoia);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
