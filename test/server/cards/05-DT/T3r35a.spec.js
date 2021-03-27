describe('T3r 35a', function () {
    describe("T3r 35a's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['armsmaster-molina', 'dust-pixie', 't3r-35a', 'chronus'],
                    inPlay: []
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should play as an upgrade without issue', function () {
            this.player1.moveCard(this.chronus, 'play area');
            this.player1.playUpgrade(this.t3r35a, this.chronus);
            this.player1.endTurn();
        });

        it('should play as a creature without issue', function () {
            this.player1.playCreature(this.t3r35a);
            this.player1.endTurn();
        });

        it('should be able to be used when it is the turn of the creature on the left', function () {
            this.player1.moveCard(this.dustPixie, 'play area');
            this.player1.playCreature(this.t3r35a, false);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
        });

        it('should be able to be used when it is the turn of the creature on the right', function () {
            this.player1.moveCard(this.dustPixie, 'play area');
            this.player1.playCreature(this.t3r35a, true);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
        });

        it('should be able to be used when it is the turn of the creature on left right', function () {
            this.player1.playCreature(this.t3r35a, true);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            // play untamed on left and use t3r
            this.player1.playCreature(this.dustPixie, true);
            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');

            // play logos on left and use t3r
            this.player1.playCreature(this.chronus, false);
            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);

            // switch back to untamed make sure it still works
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);

            // switch to sa and make sure it still works
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.amber = 1;
            this.player1.reap(this.t3r35a);
            expect(this.player1.amber).toBe(2);
        });

        it('upgraded creature should be able to be used when it is the turn of the creature on the left', function () {
            this.player1.moveCard(this.dustPixie, 'play area');
            this.player1.playCreature(this.armsmasterMolina, false);
            this.player1.playUpgrade(this.t3r35a, this.armsmasterMolina);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
        });

        it('upgraded creature should be able to be used when it is the turn of the creature on the right', function () {
            this.player1.moveCard(this.dustPixie, 'play area');
            this.player1.playCreature(this.armsmasterMolina, true);
            this.player1.playUpgrade(this.t3r35a, this.armsmasterMolina);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
        });

        it('upgraded creature should be able to be used when it is the turn of the creature on left right', function () {
            this.player1.playCreature(this.armsmasterMolina, true);
            this.player1.playUpgrade(this.t3r35a, this.armsmasterMolina);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            // play untamed on left and use t3r
            this.player1.playCreature(this.dustPixie, true);
            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');

            // play logos on left and use t3r
            this.player1.playCreature(this.chronus, false);
            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);

            // switch back to untamed make sure it still works
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);

            // switch to sa and make sure it still works
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.amber = 1;
            this.player1.reap(this.armsmasterMolina);
            expect(this.player1.amber).toBe(2);
        });

        // examples repo
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
