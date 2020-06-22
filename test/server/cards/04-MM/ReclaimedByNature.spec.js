describe('Reclaimed by Nature', function () {
    describe("Reclaimed by Nature's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['vineapple-tree', 'gebuk'],
                    hand: ['flaxia', 'reclaimed-by-nature']
                },
                player2: {
                    inPlay: ['evasion-sigil', 'troll', 'customs-office'],
                    amber: 2
                }
            });
        });

        it('should purge an artifact and resolve no bonus office since card has no bonus', function () {
            this.player1.play(this.reclaimedByNature);
            expect(this.player1).toBeAbleToSelect(this.vineappleTree);
            expect(this.player1).toBeAbleToSelect(this.customsOffice);
            expect(this.player1).toBeAbleToSelect(this.evasionSigil);
            expect(this.player1).not.toBeAbleToSelect(this.gebuk);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.customsOffice);
            expect(this.customsOffice.location).toBe('purged');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(1);
        });

        it('should reveal a card and apply default card bonus icon', function () {
            this.player1.play(this.reclaimedByNature);
            expect(this.player1).toBeAbleToSelect(this.vineappleTree);
            expect(this.player1).toBeAbleToSelect(this.customsOffice);
            expect(this.player1).toBeAbleToSelect(this.evasionSigil);
            expect(this.player1).not.toBeAbleToSelect(this.gebuk);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.vineappleTree);
            expect(this.vineappleTree.location).toBe('purged');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(2);
        });

        it('should reveal a card and apply enhanced bonus icons', function () {
            this.evasionSigil.cardData.enhancements = ['amber', 'draw', 'damage'];
            this.player1.play(this.reclaimedByNature);
            expect(this.player1).toBeAbleToSelect(this.vineappleTree);
            expect(this.player1).toBeAbleToSelect(this.customsOffice);
            expect(this.player1).toBeAbleToSelect(this.evasionSigil);
            expect(this.player1).not.toBeAbleToSelect(this.gebuk);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.evasionSigil);
            expect(this.player1).toHavePrompt('Choose a creature to damage due to bonus icon');
            expect(this.player1).toBeAbleToSelect(this.gebuk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.evasionSigil.location).toBe('purged');
            expect(this.player1.amber).toBe(3);
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.troll.tokens.damage).toBe(1);
        });
    });
});
