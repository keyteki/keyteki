describe('Shell of a Ghost', function () {
    describe("Shell of a Ghost's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['shell-of-a-ghost'],
                    inPlay: ['gub', 'echofly', 'charette']
                },
                player2: {
                    hand: ['kaupe'],
                    inPlay: ['troll', 'dust-pixie', 'krump', 'pelf'],
                    discard: ['hunting-witch', 'the-circle-of-life', 'niffle-kong', 'niffle-kong2']
                }
            });
        });

        it('should destroy each non-flank creature', function () {
            this.player1.play(this.shellOfAGhost);
            expect(this.echofly.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.gub.location).toBe('play area');
            expect(this.charette.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.pelf.location).toBe('play area');
        });

        it('should allow putting a creature from any discard pile into play and gain 2 chains', function () {
            this.player1.play(this.shellOfAGhost);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.niffleKong);
            expect(this.player1).toBeAbleToSelect(this.niffleKong2);
            expect(this.player1).not.toBeAbleToSelect(this.theCircleOfLife);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Right');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay).toContain(this.dustPixie);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.chains).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 2 chains even if there is nothing to play', function () {
            this.echofly.ward();
            this.dustPixie.ward();
            this.krump.ward();
            this.player2.moveCard(this.huntingWitch, 'hand');
            this.player2.moveCard(this.niffleKong, 'hand');
            this.player2.moveCard(this.niffleKong2, 'hand');
            this.player1.play(this.shellOfAGhost);
            expect(this.player1.chains).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not be blocked by kaupe', function () {
            this.player2.moveCard(this.kaupe, 'play area');
            this.player1.play(this.shellOfAGhost);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Right');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay).toContain(this.dustPixie);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to select a gigantic and fail to put it into play', function () {
            this.player1.play(this.shellOfAGhost);
            expect(this.player1).toBeAbleToSelect(this.niffleKong);
            expect(this.player1).toBeAbleToSelect(this.niffleKong2);
            this.player1.clickCard(this.niffleKong);
            expect(this.player1).not.toHavePrompt('Niffle Kong');
            expect(this.niffleKong.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
