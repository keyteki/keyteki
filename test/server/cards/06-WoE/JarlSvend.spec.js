describe('Jarl Svend', function () {
    describe("Jarl Svend's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    token: 'warrior',
                    house: 'brobnar',
                    inPlay: ['jarl-svend']
                },
                player2: {
                    token: 'grunt',
                    inPlay: ['mother', 'earthshaker', 'grunt:labwork', 'bad-penny']
                }
            });
        });

        it('should make a token creature when attacking and killing a creature', function () {
            this.player1.fightWith(this.jarlSvend, this.mother);
            expect(this.jarlSvend.tokens.damage).toBe(5);
            expect(this.mother.location).toBe('discard');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
        });

        it('should make a token creature even if creature destoryed does not go to discard', function () {
            this.player1.fightWith(this.jarlSvend, this.badPenny);
            expect(this.jarlSvend.tokens.damage).toBe(1);
            expect(this.badPenny.location).toBe('hand');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
        });

        it('should make a token creature when defended and killing a creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.mother, this.jarlSvend);
            expect(this.mother.location).toBe('discard');
            this.player2.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
        });

        it('should not make a token creature when Jarl Svend dies', function () {
            this.player1.fightWith(this.jarlSvend, this.earthshaker);
            expect(this.jarlSvend.location).toBe('discard');
            expect(this.earthshaker.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make a token creature when destroying a token creature', function () {
            this.player1.fightWith(this.jarlSvend, this.grunt);
            expect(this.jarlSvend.tokens.damage).toBe(3);
            expect(this.grunt.location).toBe('discard');
            expect(this.grunt.name).toBe('Labwork');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
        });
    });
});
