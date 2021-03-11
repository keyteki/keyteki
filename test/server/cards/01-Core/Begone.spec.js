describe('Begone!', function () {
    describe("Begone!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['maruck-the-marked'],
                    hand: ['begone']
                },
                player2: {
                    inPlay: ['lamindra'],
                    hand: ['shooler']
                }
            });
        });

        it('gain amber if there is no Dis in play', function () {
            this.player1.play(this.begone);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Destroy each Dis creature');
            expect(this.player1).toHavePromptButton('Gain 1 amber');
            this.player1.clickPrompt('Gain 1 amber');
            expect(this.player1.amber).toBe(1);
        });

        it('not gain amber if there is no Dis in play and decided to destroy all Dis', function () {
            this.player1.play(this.begone);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Destroy each Dis creature');
            expect(this.player1).toHavePromptButton('Gain 1 amber');
            this.player1.clickPrompt('Destroy each Dis creature');
            expect(this.player1.amber).toBe(0);
            expect(this.maruckTheMarked.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
        });
    });

    describe("Begone!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['maruck-the-marked', 'gub'],
                    hand: ['begone']
                },
                player2: {
                    inPlay: ['lamindra', 'spyyyder', 'shooler']
                }
            });
        });

        it('gain 1 amber and destroy no Dis', function () {
            this.player1.play(this.begone);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Destroy each Dis creature');
            expect(this.player1).toHavePromptButton('Gain 1 amber');
            this.player1.clickPrompt('Gain 1 amber');
            expect(this.player1.amber).toBe(1);
            expect(this.maruckTheMarked.location).toBe('play area');
            expect(this.gub.location).toBe('play area');
            expect(this.spyyyder.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.shooler.location).toBe('play area');
        });

        it('destroy each Dis creature', function () {
            this.player1.play(this.begone);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Destroy each Dis creature');
            expect(this.player1).toHavePromptButton('Gain 1 amber');
            this.player1.clickPrompt('Destroy each Dis creature');
            expect(this.player1.amber).toBe(0);
            expect(this.maruckTheMarked.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.gub.location).toBe('discard');
            expect(this.spyyyder.location).toBe('discard');
            expect(this.shooler.location).toBe('discard');
        });
    });
});
