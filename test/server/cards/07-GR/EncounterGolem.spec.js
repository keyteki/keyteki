describe('Encounter Golem', function () {
    describe("Encounter Golem's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['stealth-mode', 'cpo-zytar', 'mimicry'],
                    inPlay: ['encounter-golem'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    hand: ['press-gang'],
                    inPlay: ['troll'],
                    discard: ['burn-the-stockpile']
                }
            });
        });

        it('puts a played action card at the bottom of your deck', function () {
            this.player1.play(this.stealthMode);
            expect(this.stealthMode.location).toBe('deck');
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(
                this.stealthMode
            );
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does not put a discarded card at the bottom of your deck', function () {
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickPrompt('Discard this card');
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does not do anything for opponent', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.pressGang);
            expect(this.pressGang.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does not do anything for opponent cards played by you', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.play(this.mimicry);
            this.player1.clickCard(this.burnTheStockpile);
            expect(this.burnTheStockpile.location).toBe('discard');
            expect(this.mimicry.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does not archive on destroy if not haunted', function () {
            this.player1.fightWith(this.encounterGolem, this.troll);
            expect(this.encounterGolem.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('archives on destroy if haunted', function () {
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickPrompt('Discard this card');
            this.player1.fightWith(this.encounterGolem, this.troll);
            expect(this.encounterGolem.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
