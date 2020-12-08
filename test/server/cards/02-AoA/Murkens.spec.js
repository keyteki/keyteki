describe('Murkens', function () {
    describe("Murkens's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 2,
                    inPlay: ['lamindra'],
                    hand: ['murkens']
                },
                player2: {
                    amber: 0,
                    inPlay: ['maruck-the-marked'],
                    hand: ['bulwark'],
                    archives: ['krump', 'grenade-snib'],
                    discard: ['troll', 'first-blood']
                }
            });
            this.player2.moveCard(this.troll, 'deck');
        });

        it('when deck and archives are empty, should not have prompt', function () {
            this.player2.player.deck = [];
            this.player2.player.archives = [];
            this.player1.play(this.murkens);
            expect(this.player1).not.toHavePromptButton('Top of deck');
            expect(this.player1).not.toHavePromptButton('Random card from archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('when deck is empty, still provide option, and allow playing archived card', function () {
            this.player2.player.deck = [];
            this.player1.play(this.murkens);
            expect(this.player1).toHavePromptButton('Top of deck');
            expect(this.player1).toHavePromptButton('Random card from archives');
            this.player1.clickPrompt('Random card from archives');
            this.player1.clickPrompt('Left');

            // Randomness
            if (this.krump.location === 'archives') {
                expect(this.grenadeSnib.location).toBe('play area');
                expect(this.grenadeSnib.controller).toBe(this.player1.player);
            } else {
                expect(this.krump.location).toBe('play area');
                expect(this.krump.controller).toBe(this.player1.player);
            }
        });

        it('when archive is empty, still provide option, and allow playing top of deck card', function () {
            this.player2.player.archives = [];
            this.player1.play(this.murkens);
            expect(this.player1).toHavePromptButton('Top of deck');
            expect(this.player1).toHavePromptButton('Random card from archives');
            this.player1.clickPrompt('Top of deck');
            this.player1.clickPrompt('Left');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.controller).toBe(this.player1.player);
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('House Choice');
            expect(this.troll.controller).toBe(this.player1.player);
        });

        it('when archive is empty, should still prompt for option and play nothing if select archives', function () {
            this.player2.player.archives = [];
            this.player1.play(this.murkens);
            expect(this.player1).toHavePromptButton('Top of deck');
            expect(this.player1).toHavePromptButton('Random card from archives');
            this.player1.clickPrompt('Random card from archives');
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('House Choice');
        });

        it('when top of deck is selected, top card is played', function () {
            this.player1.play(this.murkens);
            this.player1.clickPrompt('Top of deck');
            this.player1.clickPrompt('Left');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.controller).toBe(this.player1.player);
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('House Choice');
            expect(this.troll.controller).toBe(this.player1.player);
        });

        it('when archives is selected, plays a random card from archives', function () {
            this.player1.play(this.murkens);
            this.player1.clickPrompt('Random card from archives');
            this.player1.clickPrompt('Left');

            // Randomness
            if (this.krump.location === 'archives') {
                expect(this.grenadeSnib.location).toBe('play area');
                expect(this.grenadeSnib.controller).toBe(this.player1.player);
            } else {
                expect(this.krump.location).toBe('play area');
                expect(this.krump.controller).toBe(this.player1.player);
            }
        });

        it('when deck is selected and alpha is the firt card, keep it there', function () {
            this.player2.moveCard(this.firstBlood, 'deck');
            this.player1.play(this.murkens);
            expect(this.player1).toHavePromptButton('Top of deck');
            expect(this.player1).toHavePromptButton('Random card from archives');
            this.player1.clickPrompt('Top of deck');
            expect(this.firstBlood.location).toBe('deck');
            this.player1.endTurn();
        });

        it('when archives is selected and alpha is randomly selected, keep it there', function () {
            this.player2.moveCard(this.krump, 'discard');
            this.player2.moveCard(this.grenadeSnib, 'discard');
            this.player2.moveCard(this.firstBlood, 'archives');
            this.player1.play(this.murkens);
            this.player1.clickPrompt('Random card from archives');

            expect(this.firstBlood.location).toBe('archives');
            this.player1.endTurn();
        });
    });

    describe("Murkens's ability and owned card in archive", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 2,
                    inPlay: ['uxlyx-the-zookeeper']
                },
                player2: {
                    amber: 0,
                    inPlay: ['lamindra', 'bumblebird'],
                    hand: ['murkens']
                }
            });
        });

        xit("when owner card is chosen from archive, it should go to owner's hand", function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.controller).toBe(this.player1.player);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.murkens);
            this.player2.clickPrompt('Random card from archives');

            expect(this.uxlyxTheZookeeper.location).toBe('hand');
            expect(this.lamindra.controller).toBe(this.player2.player);
            this.player2.endTurn();
        });
    });
});
