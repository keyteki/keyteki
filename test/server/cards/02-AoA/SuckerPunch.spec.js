describe('Sucker Punch', function () {
    describe("Sucker Punch's play ability (Alpha)", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['sucker-punch', 'urchin']
                },
                player2: {
                    inPlay: ['troll', 'lamindra']
                }
            });
        });

        it('deals 2 damage to a chosen enemy creature', function () {
            this.player1.play(this.suckerPunch);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.troll.location).toBe('play area');
            expect(this.lamindra.damage).toBe(0);
            expect(this.suckerPunch.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('archives Sucker Punch when it destroys the target', function () {
            this.player1.play(this.suckerPunch);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.suckerPunch.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot be played after another card has been played due to Alpha', function () {
            this.player1.play(this.urchin);
            this.player1.clickCard(this.suckerPunch);
            expect(this.player1).not.toHavePromptButton('Play this action');
            this.player1.clickPrompt('Cancel');
            expect(this.suckerPunch.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
