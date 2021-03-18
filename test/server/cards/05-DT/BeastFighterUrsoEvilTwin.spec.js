describe('Beast Fighter Urso Evil Twin', function () {
    describe("Beast Fighter Urso Evil Twin's play effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['bulwark', 'champion-anaphiel'],
                    hand: ['beast-fighter-urso-evil-twin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'murkens']
                }
            });

            this.bulwark.stun();
            this.lamindra.stun();
            this.player1.play(this.beastFighterUrsoEvilTwin);

            expect(this.bulwark.stunned).toBe(true);
            expect(this.lamindra.stunned).toBe(true);
        });

        it('should not be optional', function () {
            expect(this.player1).not.toHavePromptButton('Done');
        });

        it('should stun a creature', function () {
            expect(this.player1).toBeAbleToSelect(this.beastFighterUrsoEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.murkens);
            expect(this.murkens.stunned).toBe(true);
        });
    });

    describe("Beast Fighter Urso Evil Twin's fight effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['bulwark', 'beast-fighter-urso-evil-twin', 'champion-anaphiel']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'murkens']
                }
            });

            this.bulwark.stun();
            this.lamindra.stun();
            this.player1.fightWith(this.beastFighterUrsoEvilTwin, this.lamindra);

            expect(this.bulwark.stunned).toBe(true);
            expect(this.lamindra.stunned).toBe(true);
        });

        it('should not be optional', function () {
            expect(this.player1).not.toHavePromptButton('Done');
        });

        it('should unstun a creature', function () {
            expect(this.player1).toBeAbleToSelect(this.beastFighterUrsoEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.murkens);
            expect(this.murkens.stunned).toBe(true);
        });
    });
});
