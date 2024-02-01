describe('Singing Scythe', function () {
    describe("Singing Scythe's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['singing-scythe', 'a-strong-feeling'],
                    inPlay: ['echofly'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['charette', 'cpo-zytar'],
                    discard: ['stealth-mode']
                }
            });
            this.player1.chains = 36;
        });

        it('allows it to come back to hand when haunted in main phase', function () {
            this.player1.scrap(this.singingScythe);
            this.player1.clickCard(this.singingScythe);
            this.player1.clickPrompt('Return this card to hand');
            expect(this.singingScythe.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can not come back to hand when not haunted in main phase', function () {
            this.player1.player.discard = [];
            this.player1.scrap(this.singingScythe);
            this.player1.clickCard(this.singingScythe);
            expect(this.singingScythe.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('allows it to come back to hand when haunted at end of the round', function () {
            this.player1.scrap(this.singingScythe);
            this.player1.endTurn();
            this.player1.clickCard(this.singingScythe);
            expect(this.singingScythe.location).toBe('hand');
            this.player2.clickPrompt('staralliance');
        });

        it('can choose not to come back to hand when haunted at end of the round', function () {
            this.player1.scrap(this.singingScythe);
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            expect(this.singingScythe.location).toBe('discard');
            this.player2.clickPrompt('staralliance');
        });

        it('can not come back to hand when not haunted at end of the round', function () {
            this.player1.player.discard = [];
            this.player1.scrap(this.singingScythe);
            this.player1.endTurn();
            expect(this.singingScythe.location).toBe('discard');
            this.player2.clickPrompt('staralliance');
        });

        it('allows it to come back to hand when haunted at start of the round', function () {
            this.player1.scrap(this.singingScythe);
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('staralliance');
            this.player2.endTurn();
            this.player1.clickCard(this.singingScythe);
            expect(this.singingScythe.location).toBe('hand');
            this.player1.clickPrompt('geistoid');
        });

        it('can choose not to come back to hand when haunted at start of the round', function () {
            this.player1.scrap(this.singingScythe);
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('staralliance');
            this.player2.endTurn();
            this.player1.clickPrompt('Done');
            expect(this.singingScythe.location).toBe('discard');
            this.player1.clickPrompt('geistoid');
        });

        it('can not come back to hand when not haunted at start of the round', function () {
            this.player1.player.discard = [];
            this.player1.scrap(this.singingScythe);
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.endTurn();
            expect(this.singingScythe.location).toBe('discard');
            this.player1.clickPrompt('geistoid');
        });

        it('lets parent purge a card from a discard pile when haunted on reap', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.playUpgrade(this.singingScythe, this.echofly);
            this.player1.reap(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.poke);
            expect(this.player1).toBeAbleToSelect(this.stealthMode);
            expect(this.player1).not.toBeAbleToSelect(this.echofly);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            this.player1.clickCard(this.stealthMode);
            expect(this.stealthMode.location).toBe('purged');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does nothing when not haunted on reap', function () {
            this.player1.playUpgrade(this.singingScythe, this.echofly);
            this.player1.reap(this.echofly);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
