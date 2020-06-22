describe('Detention Coil', function () {
    describe("Detention Coil's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['explo-rover', 'medic-ingram'],
                    hand: ['detention-coil']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('creature not should be able to fight', function () {
            this.player1.playUpgrade(this.detentionCoil, this.medicIngram);
            this.player1.clickCard(this.medicIngram);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
        });
    });
});
