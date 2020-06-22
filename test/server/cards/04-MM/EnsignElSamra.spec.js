describe('Ensign El-Samra', function () {
    describe("Ensign El-Samra's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['ensign-el-samra'],
                    hand: ['virtuous-works', 'tautau-vapors']
                },
                player2: {
                    inPlay: ['troll'],
                    amber: 2
                }
            });
        });

        it('should reveal a card and do nothing if card has no bonus icons', function () {
            this.player1.useAction(this.ensignElSamra);
            expect(this.player1).toBeAbleToSelect(this.virtuousWorks);
            expect(this.player1).toBeAbleToSelect(this.tautauVapors);
            expect(this.player1).not.toBeAbleToSelect(this.ensignElSamra);
            this.player1.clickCard(this.tautauVapors);
            expect(this.tautauVapors.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(0);
        });

        it('should reveal a card and apply default card bonus icon', function () {
            this.player1.useAction(this.ensignElSamra);
            expect(this.player1).toBeAbleToSelect(this.virtuousWorks);
            expect(this.player1).toBeAbleToSelect(this.tautauVapors);
            expect(this.player1).not.toBeAbleToSelect(this.ensignElSamra);
            this.player1.clickCard(this.virtuousWorks);
            expect(this.virtuousWorks.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(3);
        });

        it('should reveal a card and apply enhanced bonus icons', function () {
            this.virtuousWorks.cardData.enhancements = ['amber', 'draw', 'damage'];
            this.player1.useAction(this.ensignElSamra);
            expect(this.player1).toBeAbleToSelect(this.virtuousWorks);
            expect(this.player1).toBeAbleToSelect(this.tautauVapors);
            expect(this.player1).not.toBeAbleToSelect(this.ensignElSamra);
            this.player1.clickCard(this.virtuousWorks);
            expect(this.player1).toHavePrompt('Choose a creature to damage due to bonus icon');
            expect(this.player1).toBeAbleToSelect(this.ensignElSamra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.virtuousWorks.location).toBe('hand');
            expect(this.player1.amber).toBe(4);
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.troll.tokens.damage).toBe(1);
        });
    });
});
