describe('Dr. Milli', function () {
    describe("Dr. Milli's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: [
                        'dr-milli',
                        'eyegor',
                        'doc-bookton',
                        'brain-eater',
                        'mother',
                        'babbling-bibliophile',
                        'groupthink-tank',
                        'jargogle'
                    ]
                },
                player2: {
                    inPlay: ['stealer-of-souls', 'overlord-greking', 'dust-imp', 'streke']
                }
            });
        });
        it('should cause the player not to get archive prompt as player and opponent have equal number of creatures not including Dr. Milli', function () {
            this.player1.play(this.mother);
            this.player1.play(this.docBookton);
            this.player1.play(this.brainEater);
            this.player1.play(this.groupthinkTank);
            this.player1.play(this.drMilli);
            expect(this.player1).not.toHavePrompt('Dr. Milli');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
        it('should cause the player not to get archive prompt as player has more creatures than opponent not including Dr. Milli', function () {
            this.player1.play(this.mother);
            this.player1.play(this.docBookton);
            this.player1.play(this.brainEater);
            this.player1.play(this.groupthinkTank);
            this.player1.play(this.babblingBibliophile);
            this.player1.play(this.drMilli);
            expect(this.player1).not.toHavePrompt('Dr. Milli');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
        it('should cause the player to archive 4 cards if the opponent has 4 creatures on the board, and dr milli is the only card in play', function () {
            this.player1.play(this.drMilli);
            expect(this.player1).toHavePrompt('Dr. Milli');
            expect(this.player1).toBeAbleToSelect(this.eyegor);
            expect(this.player1).toBeAbleToSelect(this.docBookton);
            expect(this.player1).toBeAbleToSelect(this.brainEater);
            this.player1.clickCard(this.eyegor);
            this.player1.clickCard(this.docBookton);
            this.player1.clickCard(this.brainEater);
            this.player1.clickCard(this.mother);
            this.player1.clickPrompt('Done');
            expect(this.eyegor.location).toBe('archives');
            expect(this.docBookton.location).toBe('archives');
            expect(this.brainEater.location).toBe('archives');
            expect(this.mother.location).toBe('archives');
        });
        it('should cause the player to archive 3 cards if the opponent has 4 creatures on the board, dr milli is the second card in play', function () {
            this.player1.play(this.mother);
            this.player1.play(this.drMilli);
            expect(this.player1).toHavePrompt('Dr. Milli');
            expect(this.player1).toBeAbleToSelect(this.eyegor);
            expect(this.player1).toBeAbleToSelect(this.docBookton);
            expect(this.player1).toBeAbleToSelect(this.brainEater);
            this.player1.clickCard(this.eyegor);
            this.player1.clickCard(this.docBookton);
            this.player1.clickCard(this.brainEater);
            this.player1.clickPrompt('Done');
            expect(this.eyegor.location).toBe('archives');
            expect(this.docBookton.location).toBe('archives');
            expect(this.brainEater.location).toBe('archives');
        });
    });
    describe("Dr. Milli's ability with less cards in hand", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['dr-milli', 'eyegor', 'mother']
                },
                player2: {
                    inPlay: ['stealer-of-souls', 'overlord-greking', 'dust-imp', 'streke']
                }
            });
        });
        it('should cause the player to archive 2 cards if the opponent has 4 creatures on the board, and dr milli is the only card in play', function () {
            this.player1.play(this.drMilli);
            expect(this.player1).toHavePrompt('Dr. Milli');
            expect(this.player1).toBeAbleToSelect(this.eyegor);
            expect(this.player1).toBeAbleToSelect(this.mother);
            this.player1.clickCard(this.eyegor);
            this.player1.clickCard(this.mother);
            this.player1.clickPrompt('Done');
            expect(this.eyegor.location).toBe('archives');
            expect(this.mother.location).toBe('archives');
        });
        it('should cause the player to archive 1 card if the opponent has 4 creatures on the board, dr milli is the second card in play', function () {
            this.player1.play(this.mother);
            this.player1.play(this.drMilli);
            expect(this.player1).toHavePrompt('Dr. Milli');
            expect(this.player1).toBeAbleToSelect(this.eyegor);
            this.player1.clickCard(this.eyegor);
            this.player1.clickPrompt('End Turn');
            expect(this.eyegor.location).toBe('archives');
        });
    });
});
