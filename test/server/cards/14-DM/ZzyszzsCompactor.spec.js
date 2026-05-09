describe("Zzyszz's Compactor", function () {
    describe("Compactor's action", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['zzyszz-s-compactor', 'iyxrenu-the-clever']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('can target an enemy creature for the deck and a friendly creature for counters', function () {
            const deckSize = this.player2.player.deck.length;
            this.player1.useAction(this.zzyszzSCompactor);
            expect(this.player1).not.toBeAbleToSelect(this.zzyszzSCompactor);
            expect(this.player1).toBeAbleToSelect(this.iyxrenuTheClever);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.troll);
            expect(this.player2.player.deck.length).toBe(deckSize + 1);
            expect(this.player2.player.deck[this.player2.player.deck.length - 1].id).toBe('troll');
            expect(this.player1).toBeAbleToSelect(this.iyxrenuTheClever);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.iyxrenuTheClever);
            expect(this.iyxrenuTheClever.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target a friendly creature for the deck and an enemy creature for counters', function () {
            const deckSize = this.player1.player.deck.length;
            this.player1.useAction(this.zzyszzSCompactor);
            this.player1.clickCard(this.iyxrenuTheClever);
            expect(this.player1.player.deck.length).toBe(deckSize + 1);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with General Sherman', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['general-sherman'],
                    inPlay: ['zzyszz-s-compactor']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('returning Sherman to deck brings purged creature back, which can receive +1 counters', function () {
            this.player1.play(this.generalSherman);
            expect(this.troll.location).toBe('purged');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.useAction(this.zzyszzSCompactor);
            this.player1.clickCard(this.generalSherman);
            expect(this.troll.location).toBe('play area');
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
