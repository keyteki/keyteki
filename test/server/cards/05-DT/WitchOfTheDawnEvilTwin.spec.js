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

        it('should allow destruction of a friendly creature, and ability to bring back a different creature than was destroyed', function () {
            this.player1.play(this.witchOfTheDawnEvilTwin);
            this.player1.clickCard(this.flaxia);
            expect(this.witchOfTheDawnEvilTwin.location).toBe('play area');
            expect(this.flaxia.location).toBe('discard');
            // end the turn to confirm there are no active prompts
            // there should be no prompt since the only creature in the discard
            // is flaxia
            this.player1.endTurn();
        });

        it('should allow destruction of a friendly creature, and ability to bring back a different creature than was destroyed and use it', function () {
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
            expect(this.krump.damage).toBe(4);

            // choose to reap or fight with murmook
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.wardrummer);
            expect(this.wardrummer.location).toBe('discard');
            expect(this.musthicMurmook.location).toBe('play area');
            expect(this.musthicMurmook.damage).toBe(3);

            // end the turn to confirm there are no active prompts
            this.player1.endTurn();

            expect(this.witchOfTheDawnEvilTwin.location).toBe('play area');
        });
    });
});
