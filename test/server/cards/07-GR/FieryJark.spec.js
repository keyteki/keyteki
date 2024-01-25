describe('Fiery Jark', function () {
    describe("Fiery Jark's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['fiery-jark'],
                    inPlay: ['cpo-zytar', 'troll']
                },
                player2: {
                    inPlay: ['flaxia', 'hunting-witch']
                }
            });
        });

        it('destroys creatures in pairs while it can', function () {
            this.player1.playCreature(this.fieryJark);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.fieryJark);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.fieryJark);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickPrompt('Yes');
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.fieryJark);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.fieryJark);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.fieryJark.location).toBe('play area');
        });

        it('allows stopping after the first pair', function () {
            this.player1.playCreature(this.fieryJark);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickPrompt('No');
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.fieryJark.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('stops when it destroys self', function () {
            this.player1.playCreature(this.fieryJark);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.fieryJark);
            expect(this.cpoZytar.location).toBe('play area');
            expect(this.flaxia.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.fieryJark.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
