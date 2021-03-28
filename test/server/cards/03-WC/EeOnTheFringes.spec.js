describe('E’e on the Fringes', function () {
    describe("E’e on the Fringes's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    hand: ['shooler', 'redlock'],
                    inPlay: ['e-e-on-the-fringes']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('when a card is played, should have no prompt', function () {
            this.player1.play(this.redlock);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('when a non-Dis card is discarded, should have no prompt', function () {
            this.player1.clickCard(this.redlock);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("E’e on the Fringes's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    hand: ['shooler', 'redlock', 'three-fates'],
                    inPlay: ['e-e-on-the-fringes']
                },
                player2: {
                    amber: 5
                }
            });

            this.player1.moveCard(this.redlock, 'discard');
            this.player1.moveCard(this.shooler, 'discard');
        });

        it('when Dis-card is discarded, should have a prompt and be able to cancel', function () {
            this.player1.clickCard(this.threeFates);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1).toHavePrompt('E’e on the Fringes');
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.threeFates);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
        });

        it('when Dis-card is discarded, should have a prompt, purge one card and steal 1A', function () {
            this.player1.clickCard(this.threeFates);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1).toHavePrompt('E’e on the Fringes');
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.threeFates);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
            expect(this.threeFates.location).toBe('discard');
            expect(this.shooler.location).toBe('purged');
        });
    });
});
