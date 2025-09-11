describe('Concussive Transfer', function () {
    describe("COncussive Transfer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['concussive-transfer'],
                    inPlay: ['foozle', 'cpo-zytar', 'flamethrower']
                },
                player2: {
                    inPlay: ['troll', 'hunting-witch', 'flaxia']
                }
            });
        });

        it('deals 3 to a creature and then redistributes all damage', function () {
            this.player1.useAction(this.flamethrower);
            this.player1.clickCard(this.huntingWitch);
            this.player1.play(this.concussiveTransfer);
            this.player1.clickCard(this.troll);
            // 6 damage was out there, all healed now.
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.foozle.tokens.damage).toBe(undefined);
            expect(this.cpoZytar.tokens.damage).toBe(undefined);
            expect(this.huntingWitch.tokens.damage).toBe(undefined);
            expect(this.flaxia.tokens.damage).toBe(undefined);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.cpoZytar);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.troll.tokens.damage).toBe(5);
            expect(this.foozle.tokens.damage).toBe(undefined);
            expect(this.cpoZytar.tokens.damage).toBe(1);
            expect(this.huntingWitch.tokens.damage).toBe(undefined);
            expect(this.flaxia.tokens.damage).toBe(undefined);
        });
    });
});
