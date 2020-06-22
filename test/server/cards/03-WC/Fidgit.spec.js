describe('Fidgit', function () {
    describe("Fidgit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['fidgit']
                },
                player2: {
                    inPlay: ['maruck-the-marked'],
                    hand: ['bulwark'],
                    discard: ['the-warchest', 'troll', 'krump', 'virtuous-works', 'clear-mind']
                }
            });
        });
        it('when deck and archives are empty, should not have prompt', function () {
            this.player2.player.deck = [];
            this.player2.player.archives = [];
            this.player1.reap(this.fidgit);
            expect(this.player1).not.toHavePrompt('Top of deck');
            expect(this.player1).not.toHavePrompt('Random card from archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
        it('when deck is empty, play archived card directly', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.clearMind, 'archives');
            this.player2.moveCard(this.virtuousWorks, 'archives');
            this.player1.reap(this.fidgit);
            expect(this.player1).not.toHavePrompt('Top of deck');
            expect(this.player1).not.toHavePrompt('Random card from archives');

            // Randomness
            if (this.virtuousWorks.location === 'archives') {
                expect(this.clearMind.location).toBe('discard');
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(0);
            } else {
                expect(this.virtuousWorks.location).toBe('discard');
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(0);
            }
        });
        it('when archive is empty, play top of deck card directly', function () {
            this.player2.player.archives = [];
            this.player2.moveCard(this.virtuousWorks, 'deck');
            this.player1.reap(this.fidgit);
            expect(this.player1).not.toHavePrompt('Top of deck');
            expect(this.player1).not.toHavePrompt('Random card from archives');
            expect(this.virtuousWorks.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
        });
        it('when top of deck is selected, top action card is played', function () {
            this.player2.moveCard(this.virtuousWorks, 'deck');
            this.player2.moveCard(this.clearMind, 'archives');

            this.player1.reap(this.fidgit);
            this.player1.clickPrompt('Top of deck');

            expect(this.virtuousWorks.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
        });
        it('when archives is selected, plays a random action card from archives', function () {
            this.player2.moveCard(this.virtuousWorks, 'archives');
            this.player2.moveCard(this.clearMind, 'archives');

            this.player1.reap(this.fidgit);
            this.player1.clickPrompt('Random card from archives');

            // Randomness
            if (this.virtuousWorks.location === 'archives') {
                expect(this.clearMind.location).toBe('discard');
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(0);
            } else {
                expect(this.virtuousWorks.location).toBe('discard');
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(0);
            }
        });
        it('when top of deck is selected, top artifact card is discarded', function () {
            this.player2.moveCard(this.theWarchest, 'deck');
            this.player2.moveCard(this.clearMind, 'archives');

            this.player1.reap(this.fidgit);
            this.player1.clickPrompt('Top of deck');

            expect(this.theWarchest.location).toBe('discard');
        });
        it('when archives is selected, discards a random creature card from archives', function () {
            this.player2.moveCard(this.troll, 'archives');
            this.player2.moveCard(this.krump, 'archives');

            this.player1.reap(this.fidgit);
            this.player1.clickPrompt('Random card from archives');

            // Randomness
            if (this.krump.location === 'archives') {
                expect(this.troll.location).toBe('discard');
            } else {
                expect(this.krump.location).toBe('discard');
            }
        });
    });
    describe("Fidgit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['fidgit', 'mother']
                },
                player2: {
                    inPlay: ['maruck-the-marked', 'collector-worm'],
                    hand: ['bulwark'],
                    discard: ['ghostly-hand']
                }
            });
        });
        it('should not play an action from the discard if the player chooses archives and returns a creature', function () {
            this.player2.moveCard(this.bulwark, 'deck');
            this.player2.player.archives = [];
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.fightWith(this.collectorWorm, this.mother);
            expect(this.mother.location).toBe('archives');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player2.archives.length).toBe(1);
            this.player1.clickCard(this.fidgit);
            expect(this.player1).toHavePrompt('Choose an ability:');
            this.player1.clickPrompt('Reap with this Creature');
            expect(this.player1).toHavePrompt('Select One');
            this.player1.clickPrompt('Random card from archives');
            expect(this.mother.location).toBe('hand');
            expect(this.player1.amber).toBe(1);
        });
    });
});
