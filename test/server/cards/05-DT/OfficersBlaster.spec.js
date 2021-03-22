describe('Officers Blaster', function () {
    describe('ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['officer-s-blaster', 'quintrino-flux'],
                    inPlay: ['dust-pixie', 'stealthster', 'fanghouse']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should increase power while on a creature', function () {
            expect(this.stealthster.power).toBe(3);
            this.player1.playUpgrade(this.officerSBlaster, this.stealthster);
            expect(this.stealthster.power).toBe(5);
            this.player1.endTurn();
        });

        it('should go to discard when there are no other creatures', function () {
            this.player1.moveCard(this.fanghouse, 'discard');
            this.player1.moveCard(this.dustPixie, 'discard');
            this.player1.playUpgrade(this.officerSBlaster, this.stealthster);
            this.player1.play(this.quintrinoFlux);
            this.player1.clickCard(this.stealthster); // destroy for qf
            this.player1.clickCard(this.krump); // destroy for qf

            this.player1.endTurn();
            expect(this.officerSBlaster.location).toBe('discard');
            expect(this.stealthster.location).toBe('discard');
        });

        it('should go to discard when there is no creature on the right, but is one on the left', function () {
            this.player1.moveCard(this.fanghouse, 'discard');
            this.player1.playUpgrade(this.officerSBlaster, this.stealthster);
            this.player1.play(this.quintrinoFlux);
            this.player1.clickCard(this.stealthster); // destroy for qf
            this.player1.clickCard(this.krump); // destroy for qf

            this.player1.endTurn();
            expect(this.officerSBlaster.location).toBe('discard');
            expect(this.stealthster.location).toBe('discard');
        });

        xit('should go to creature on the right when destroyed, when a left and right neighor exist', function () {
            expect(this.fanghouse.power).toBe(3);
            this.player1.playUpgrade(this.officerSBlaster, this.stealthster);
            this.player1.play(this.quintrinoFlux);
            this.player1.clickCard(this.stealthster); // destroy for qf
            this.player1.clickCard(this.krump); // destroy for qf
            this.player1.clickCard(this.fanghouse); // select to take blaster

            this.player1.endTurn();
            expect(this.fanghouse.location).toBe('play area');
            expect(this.fanghouse.power).toBe(5);
            expect(this.officerSBlaster.location).not.toBe('discard');
            expect(this.stealthster.location).toBe('discard');
        });

        it('should go to creature on right when destroyed when only a right neighor exists', function () {
            this.player1.moveCard(this.dustPixie, 'discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.fanghouse.power).toBe(3);
            this.player1.playUpgrade(this.officerSBlaster, this.stealthster);
            expect(this.stealthster.upgrades).toContain(this.officerSBlaster);
            this.player1.play(this.quintrinoFlux);
            this.player1.clickCard(this.stealthster);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.fanghouse);

            this.player1.endTurn();
            expect(this.stealthster.upgrades).not.toContain(this.officerSBlaster);
            expect(this.fanghouse.upgrades).toContain(this.officerSBlaster);
            expect(this.fanghouse.location).toBe('play area');
            expect(this.fanghouse.power).toBe(5);
            expect(this.officerSBlaster.location).not.toBe('discard');
            expect(this.stealthster.location).toBe('discard');
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
