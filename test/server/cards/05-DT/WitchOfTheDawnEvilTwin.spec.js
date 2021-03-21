describe('Witch Of The Dawn Evil Twin', function () {
    describe("Witch Of The Dawn Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['witch-of-the-dawn-evil-twin', 'dust-pixie', 'musthic-murmook'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'wardrummer']
                }
            });
        });

        it('should be playable when no other creatures are in play', function () {
            this.player1.moveCard(this.flaxia, 'discard');
            this.player1.play(this.witchOfTheDawnEvilTwin);
            // end the turn to confirm there are no active prompts
            this.player1.endTurn();
            expect(this.witchOfTheDawnEvilTwin.location).toBe('play area');
        });

        it('should prompt for destruction when other creatures are in play', function () {
            this.player1.play(this.dustPixie);
            this.player1.play(this.witchOfTheDawnEvilTwin);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.witchOfTheDawnEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.flaxia);
            expect(this.witchOfTheDawnEvilTwin.location).toBe('play area');
            expect(this.flaxia.location).toBe('discard');
        });

        it('should allow destruction of a friendly creature, and ability to bring back a differnt creature than was destroyed', function () {
            this.player1.play(this.witchOfTheDawnEvilTwin);
            this.player1.clickCard(this.flaxia);
            expect(this.witchOfTheDawnEvilTwin.location).toBe('play area');
            expect(this.flaxia.location).toBe('discard');
            // end the turn to confirm there are no active prompts
            // there should be no prompt since the only creature in the discard
            // is flaxia
            this.player1.endTurn();
        });

        it('should allow destruction of a friendly creature, and ability to bring back a differnt creature than was destroyed', function () {
            this.player1.moveCard(this.musthicMurmook, 'discard');
            expect(this.musthicMurmook.location).toBe('discard');

            this.player1.play(this.witchOfTheDawnEvilTwin);

            // choose to destroy flaxia
            this.player1.clickCard(this.flaxia);
            expect(this.witchOfTheDawnEvilTwin.location).toBe('play area');
            expect(this.flaxia.location).toBe('discard');

            // now choose which creatrure to return to play
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.musthicMurmook);
            this.player1.clickCard(this.musthicMurmook);
            this.player1.clickPrompt('Right');

            // resolve play effect of murmook
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(4);

            // choose to reap or fight with murmook
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.wardrummer);
            expect(this.wardrummer.location).toBe('discard');
            expect(this.musthicMurmook.location).toBe('play area');
            expect(this.musthicMurmook.tokens.damage).toBe(3);

            // end the turn to confirm there are no active prompts
            this.player1.endTurn();

            expect(this.witchOfTheDawnEvilTwin.location).toBe('play area');
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
