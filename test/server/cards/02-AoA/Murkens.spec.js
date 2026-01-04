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
                    discard: ['troll']
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
            expect(this.player1).isReadyToTakeAction();
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
    });
});
