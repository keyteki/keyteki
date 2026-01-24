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
            this.player1.useOmni(this.kathaTheWise);
            this.player1.playCreature(this.fuzzyGruen);
            expect(this.fuzzyGruen.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow playing non-Untamed creatures', function () {
            this.player1.useOmni(this.kathaTheWise);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.helperBot);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.lostInTheWoods);
            expect(this.player1).isReadyToTakeAction();
            this.player1.playCreature(this.eunoia);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
