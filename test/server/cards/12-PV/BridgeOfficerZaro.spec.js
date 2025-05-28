describe('Bridge Officer Zaro', function () {
    describe("Bridge Officer Zaro's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['bridge-officer-zaro', 'medic-ingram', 'cpo-zytar', 'ember-imp'],
                    amber: 3
                },
                player2: {
                    inPlay: ['urchin'],
                    amber: 3
                }
            });

            this.medicIngram.exhausted = true;
            this.cpoZytar.exhausted = true;
            this.emberImp.exhausted = true;
        });

        it('should capture 3 amber and ready a friendly non-Alien creature after fight', function () {
            this.player1.fightWith(this.bridgeOfficerZaro, this.urchin);
            expect(this.player2.amber).toBe(0);
            expect(this.bridgeOfficerZaro.amber).toBe(3);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.medicIngram);
            expect(this.medicIngram.exhausted).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not ready an Alien creature if you do not capture 3', function () {
            this.player2.amber = 2;
            this.player1.fightWith(this.bridgeOfficerZaro, this.urchin);
            expect(this.player2.amber).toBe(0);
            expect(this.bridgeOfficerZaro.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
