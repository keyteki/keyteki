describe('Dark Memento', function () {
    describe("Dark Memento's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['dark-memento'],
                    inPlay: ['dominator-bauble', 'charette', 'sinder'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['hunting-witch', 'flaxia', 'gub'],
                    discard: new Array(8).fill('poke') // not yet haunted
                }
            });
            this.player1.moveCard(this.dominatorBauble, 'deck');
            this.player1.moveCard(this.charette, 'deck');
            this.player1.moveCard(this.sinder, 'deck');
            this.player2.moveCard(this.huntingWitch, 'deck');
            this.player2.moveCard(this.flaxia, 'deck');
            this.player2.moveCard(this.gub, 'deck');
            this.player1.chains = 36;
            this.player2.chains = 36;
        });

        it('makes you haunted at the start of your turn', function () {
            this.player1.play(this.darkMemento);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('geistoid');
            expect(this.sinder.location).toBe('discard');
            expect(this.charette.location).toBe('deck');
            expect(this.dominatorBauble.location).toBe('deck');
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.flaxia.location).toBe('deck');
            expect(this.gub.location).toBe('deck');
        });

        it('stops when you run out of deck, even if not haunted', function () {
            this.player1.play(this.darkMemento);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player1.player.discard = [];
            this.player1.player.deck = [this.sinder, this.charette];
            this.player2.endTurn();
            this.player1.clickPrompt('geistoid');
            expect(this.sinder.location).toBe('discard');
            expect(this.charette.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.flaxia.location).toBe('deck');
            expect(this.gub.location).toBe('deck');
        });

        it('can discard cards top of player deck on scrap, until haunted', function () {
            this.player1.player.discard = this.player1.player.discard.slice(0, 6);
            this.player1.clickCard(this.darkMemento);
            this.player1.clickPrompt('Discard this card');
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.discard.length).toBe(8);
            expect(this.sinder.location).toBe('discard');
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.discard.length).toBe(9);
            expect(this.charette.location).toBe('discard');
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.discard.length).toBe(10);
            expect(this.dominatorBauble.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can discard cards top of opponent deck on scrap, until haunted', function () {
            this.player1.clickCard(this.darkMemento);
            this.player1.clickPrompt('Discard this card');
            this.player1.clickPrompt("Opponent's");
            expect(this.player2.player.discard.length).toBe(9);
            expect(this.gub.location).toBe('discard');
            this.player1.clickPrompt("Opponent's");
            expect(this.player2.player.discard.length).toBe(10);
            expect(this.flaxia.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can discard cards top of both decks on scrap, until one player is haunted', function () {
            this.player1.player.discard = this.player1.player.discard.slice(0, 6);
            this.player1.clickCard(this.darkMemento);
            this.player1.clickPrompt('Discard this card');
            this.player1.clickPrompt("Opponent's");
            expect(this.player2.player.discard.length).toBe(9);
            expect(this.gub.location).toBe('discard');
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.discard.length).toBe(8);
            expect(this.sinder.location).toBe('discard');
            this.player1.clickPrompt("Opponent's");
            expect(this.player2.player.discard.length).toBe(10);
            expect(this.flaxia.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.charette.location).toBe('deck');
            expect(this.dominatorBauble.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
