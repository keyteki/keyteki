describe('Bestiarii Urso', function () {
    describe("Bestiarii Urso's play effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['bulwark', 'champion-anaphiel'],
                    hand: ['bestiarii-urso']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'murkens']
                }
            });

            this.bulwark.stun();
            this.lamindra.stun();
            this.player1.play(this.bestiariiUrso);

            expect(this.bulwark.stunned).toBe(true);
            expect(this.lamindra.stunned).toBe(true);
        });

        it('should be optional', function () {
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should unstun a creature', function () {
            expect(this.player1).toBeAbleToSelect(this.bestiariiUrso);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.bulwark);
            expect(this.bulwark.stunned).toBe(false);
        });
    });

    describe("Bestiarii Urso's reap effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['bulwark', 'bestiarii-urso', 'champion-anaphiel']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'murkens']
                }
            });

            this.bulwark.stun();
            this.lamindra.stun();
            this.player1.reap(this.bestiariiUrso);

            expect(this.bulwark.stunned).toBe(true);
            expect(this.lamindra.stunned).toBe(true);
        });

        it('should be optional', function () {
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should unstun a creature', function () {
            expect(this.player1).toBeAbleToSelect(this.bestiariiUrso);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.bulwark);
            expect(this.bulwark.stunned).toBe(false);
        });
    });
});
