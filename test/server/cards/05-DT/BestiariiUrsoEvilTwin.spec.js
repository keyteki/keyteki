describe('Bestiarii Urso Evil Twin', function () {
    describe("Bestiarii Urso Evil Twin's play effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['bulwark', 'champion-anaphiel'],
                    hand: ['bestiarii-urso-evil-twin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'murkens']
                }
            });

            this.bulwark.stun();
            this.lamindra.stun();
            this.player1.play(this.bestiariiUrsoEvilTwin);

            expect(this.bulwark.stunned).toBe(true);
            expect(this.lamindra.stunned).toBe(true);
        });

        it('should not be optional', function () {
            expect(this.player1).not.toHavePromptButton('Done');
        });

        it('should stun a creature', function () {
            expect(this.player1).toBeAbleToSelect(this.bestiariiUrsoEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.murkens);
            expect(this.murkens.stunned).toBe(true);
        });
    });

    describe("Bestiarii Urso Evil Twin's fight effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['bulwark', 'bestiarii-urso-evil-twin', 'champion-anaphiel']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'murkens']
                }
            });

            this.bulwark.stun();
            this.lamindra.stun();
            this.player1.fightWith(this.bestiariiUrsoEvilTwin, this.lamindra);

            expect(this.bulwark.stunned).toBe(true);
            expect(this.lamindra.stunned).toBe(true);
        });

        it('should not be optional', function () {
            expect(this.player1).not.toHavePromptButton('Done');
        });

        it('should unstun a creature', function () {
            expect(this.player1).toBeAbleToSelect(this.bestiariiUrsoEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.murkens);
            expect(this.murkens.stunned).toBe(true);
        });
    });
});
