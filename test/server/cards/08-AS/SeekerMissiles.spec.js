describe('Scalawag Finn', function () {
    describe("Scalawag Finn's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['seeker-missiles', 'bux-bastian'],
                    inPlay: ['bosun-creen', 'dust-pixie']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should deal 2 damage for one Skyborn flank creature', function () {
            this.player1.play(this.seekerMissiles);
            expect(this.player1).toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal 2 damage for two Skyborn flank creatures', function () {
            this.player1.playCreature(this.buxBastian);
            this.player1.play(this.seekerMissiles);
            expect(this.player1).toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.krump.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to all deal damage to small creature', function () {
            this.player1.playCreature(this.buxBastian);
            this.player1.play(this.seekerMissiles);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
