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
                    discard: [
                        'the-warchest',
                        'first-blood',
                        'troll',
                        'krump',
                        'virtuous-works',
                        'clear-mind'
                    ]
                }
            });
        });

        it('when deck and archives are empty, should not have prompt', function () {
            this.player2.player.deck = [];
            this.player2.player.archives = [];
            this.player1.reap(this.fidgit);
            expect(this.player1).not.toHavePromptButton('Top of deck');
            expect(this.player1).not.toHavePromptButton('Random card from archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('when deck is empty, still provide option, and allow playing archived card', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.clearMind, 'archives');
            this.player2.moveCard(this.virtuousWorks, 'archives');
            this.player1.reap(this.fidgit);
            expect(this.player1).toHavePromptButton('Top of deck');
            expect(this.player1).toHavePromptButton('Random card from archives');
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

        it('when archive is empty, still provide option, and allow playing top of deck card', function () {
            this.player2.moveCard(this.virtuousWorks, 'deck');
            this.player2.player.archives = [];
            this.player1.reap(this.fidgit);
            expect(this.player1).toHavePromptButton('Top of deck');
            expect(this.player1).toHavePromptButton('Random card from archives');
            this.player1.clickPrompt('Top of deck');
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
            expect(this.player1).isReadyToTakeAction();
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

        it('when deck is selected and alpha is the firt card, keep it in discard', function () {
            this.player2.moveCard(this.firstBlood, 'deck');
            this.player1.reap(this.fidgit);
            expect(this.player1).toHavePromptButton('Top of deck');
            expect(this.player1).toHavePromptButton('Random card from archives');
            this.player1.clickPrompt('Top of deck');
            expect(this.firstBlood.location).toBe('discard');
            this.player1.endTurn();
        });

        it('when archives is selected and alpha is randomly selected, keep it in discard', function () {
            this.player2.moveCard(this.firstBlood, 'archives');
            this.player1.reap(this.fidgit);
            this.player1.clickPrompt('Random card from archives');

            expect(this.firstBlood.location).toBe('discard');
            this.player1.endTurn();
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
            expect(this.player1).isReadyToTakeAction();
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

    describe("Fidgit's ability with Vapor Imp", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['bosun-creen', 'vapor-imp'],
                    hand: ['dust-imp'],
                    discard: ['seeker-missiles']
                },
                player2: {
                    house: 'shadows',
                    inPlay: ['fidgit']
                }
            });
        });

        it('should be able to play non-creature cards', function () {
            this.player1.reap(this.vaporImp);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player1.moveCard(this.seekerMissiles, 'deck');
            this.player2.reap(this.fidgit);
            expect(this.player2).toHavePrompt('Fidgit');
            this.player2.clickPrompt('Top of deck');
            expect(this.player2).toHavePrompt('Seeker Missiles');
            this.player2.clickCard(this.bosunCreen);
            expect(this.bosunCreen.damage).toBe(2);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
