describe('Beast Fighter Urso', function () {
    describe("Beast Fighter Urso's play effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['bulwark', 'champion-anaphiel'],
                    hand: ['beast-fighter-urso']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'murkens']
                }
            });

            this.bulwark.stun();
            this.lamindra.stun();
            this.player1.play(this.beastFighterUrso);

            expect(this.bulwark.stunned).toBe(true);
            expect(this.lamindra.stunned).toBe(true);
        });

        it('should be optional', function () {
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should unstun a creature', function () {
            expect(this.player1).toBeAbleToSelect(this.beastFighterUrso);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.bulwark);
            expect(this.bulwark.stunned).toBe(false);
        });
    });

    describe("Beast Fighter Urso's reap effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['bulwark', 'beast-fighter-urso', 'champion-anaphiel']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'murkens']
                }
            });

            this.bulwark.stun();
            this.lamindra.stun();
            this.player1.reap(this.beastFighterUrso);

            expect(this.bulwark.stunned).toBe(true);
            expect(this.lamindra.stunned).toBe(true);
        });

        it('should be optional', function () {
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should unstun a creature', function () {
            expect(this.player1).toBeAbleToSelect(this.beastFighterUrso);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.bulwark);
            expect(this.bulwark.stunned).toBe(false);
        });
    });
});
