describe('Teamwork', function () {
    describe("Teamwork's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['bubbles', 'teamwork', 'away-team', 'agent-sepdia'],
                    inPlay: ['earthshaker'],
                    token: 'grumpus'
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'ged-hammer']
                }
            });
        });

        it('should make a token and archive if more enemy', function () {
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player2.player.creaturesInPlay.length).toBe(3);

            this.player1.play(this.teamwork);
            this.player1.clickPrompt('Left');

            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.teamwork.location).toBe('archives');
            this.player1.endTurn();
        });

        it('should make a token and not archive if equal creatures', function () {
            this.player1.playCreature(this.awayTeam, true);
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player2.player.creaturesInPlay.length).toBe(3);

            this.player1.play(this.teamwork);
            this.player1.clickPrompt('Left');

            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.teamwork.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should make a token and not archive if more creatures than enemy', function () {
            this.player1.playCreature(this.agentSepdia, true);
            this.player1.playCreature(this.awayTeam, true);
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player2.player.creaturesInPlay.length).toBe(3);

            this.player1.play(this.teamwork);
            this.player1.clickPrompt('Left');

            expect(this.player1.player.creaturesInPlay.length).toBe(4);
            expect(this.teamwork.location).toBe('discard');
            this.player1.endTurn();
        });

        // examples repo (clean bellow after use)
        /*
        it('turn ending test', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('untamed');
        });

        it('creature token', function () {
            expect(this.mookling.tokens.power).toBeUndefined();
            this.mookling.addToken('power');
            expect(this.mookling.tokens.power).toBe(1);
            
            expect(this.mookling.tokens.damage).toBeUndefined();
            this.mookling.addToken('damage');
            expect(this.mookling.tokens.damage).toBe(1);
            
            expect(this.mookling.tokens.amber).toBeUndefined();
            this.mookling.addToken('amber');
            expect(this.mookling.tokens.amber).toBe(1);
        });

        it('creature amber test', function () {
            this.urchin.tokens.amber = 1;
        });

        it('location tests', function () {
            expect(this.mother.location).toBe('discard');
            expect(this.mother.location).toBe('hand');
            expect(this.mother.location).toBe('deck');
            expect(this.mother.location).toBe('play area');
        });

        it('game interation selection', function () {
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.larva);
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).not.toHavePromptButton('Done');
        });

        it('basic actions tests', function () {
            this.player1.play(this.cocoon);
            this.player1.useAction(this.cocoon);
            this.player1.reap(this.cocoon);
            this.player1.fight(this.cocoon);
        });

        it('player amber test', function () {
            this.player1.amber = 2
            expect(this.player1.amber).toBe(2);
        });

        it('tide test', function () {
            this.player1.lowerTide();
            expect(this.player1.isTideHigh()).toBe(false);
            this.player1.raiseTide();
        });

        it('moving cards test', function () {
            this.player1.moveCard(this.butterfly, 'play area');
            this.player1.moveCard(this.butterfly, 'discard');
            this.player1.moveCard(this.butterfly, 'hand');
        });
        */
    });
});
