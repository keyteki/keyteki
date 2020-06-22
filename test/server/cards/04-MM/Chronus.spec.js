describe('Chronus', function () {
    describe("Chronus's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['chronus', 'doc-bookton'],
                    hand: ['dextre', 'tautau-vapors', 'poke', 'mimic-gel']
                },
                player2: {
                    amber: 2,
                    hand: ['mab-the-mad']
                }
            });
        });

        it('should have option to archive card and be able to decline', function () {
            this.dextre.cardData.enhancements = ['amber', 'draw', 'amber'];

            this.player1.play(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.chronus);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(2);
        });

        it('should have option to archive card and choose to archive a card', function () {
            this.dextre.cardData.enhancements = ['amber', 'amber', 'draw'];

            this.player1.play(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.chronus);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.chronus);
            expect(this.player1).toBeAbleToSelect(this.poke);
            expect(this.player1).toBeAbleToSelect(this.tautauVapors);
            expect(this.player1).toBeAbleToSelect(this.mimicGel);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.mimicGel);
            expect(this.mimicGel.location).toBe('archives');
            expect(this.player1.amber).toBe(2);
        });

        it("should interact before card's effect", function () {
            this.tautauVapors.cardData.enhancements = ['draw', 'amber', 'amber'];

            expect(this.player1.player.hand.length).toBe(4);
            this.player1.play(this.tautauVapors);
            expect(this.player1.player.hand.length).toBe(4);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.hand.length).toBe(6);
            this.player1.clickCard(this.mimicGel);
            expect(this.player1.player.hand.length).toBe(5);
            expect(this.mimicGel.location).toBe('archives');
            expect(this.player1.amber).toBe(2);
        });

        it('should work with multiple draw icons', function () {
            this.dextre.cardData.enhancements = ['draw', 'draw', 'draw', 'draw'];

            this.player1.play(this.dextre);
            this.player1.clickCard(this.chronus);
            this.player1.clickCard(this.mimicGel);
            this.player1.clickCard(this.chronus);
            this.player1.clickCard(this.poke);
            this.player1.clickCard(this.chronus);
            this.player1.clickCard(this.tautauVapors);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.hand.length).toBe(4);
            expect(this.mimicGel.location).toBe('archives');
            expect(this.poke.location).toBe('archives');
            expect(this.tautauVapors.location).toBe('archives');
            expect(this.player1.amber).toBe(0);
        });

        it('should work with cards that have default amber icon', function () {
            this.poke.cardData.enhancements = ['draw'];

            this.player1.play(this.poke);
            expect(this.player1).toBeAbleToSelect(this.chronus);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1.player.hand.length).toBe(4);
            expect(this.player1.amber).toBe(1);
        });

        it('should work with Mimic Gel', function () {
            this.dextre.cardData.enhancements = ['draw'];

            this.player1.play(this.mimicGel);
            this.player1.clickCard(this.chronus);
            this.player1.play(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.chronus);
            expect(this.player1).toBeAbleToSelect(this.mimicGel);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.mimicGel);
            this.player1.clickCard(this.poke);
            expect(this.player1).toBeAbleToSelect(this.chronus);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.poke.location).toBe('archives');
            expect(this.player1.amber).toBe(0);
        });

        it('should not have an option to archive, if no D enhancement', function () {
            this.dextre.cardData.enhancements = ['amber', 'amber'];

            this.player1.play(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.chronus);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(2);
        });

        it("should not be prompted to archive if opponent's play D card", function () {
            this.mabTheMad.cardData.enhancements = ['draw', 'amber'];
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.mabTheMad);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
