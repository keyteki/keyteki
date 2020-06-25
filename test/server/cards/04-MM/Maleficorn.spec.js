describe('Maleficorn', function () {
    describe("Maleficorn's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['troll', 'maleficorn'],
                    hand: ['binding-irons', 'guilty-hearts', 'gongoozle']
                },
                player2: {
                    amber: 2,
                    inPlay: ['alaka', 'brammo'],
                    hand: ['burn-the-stockpile']
                }
            });
        });

        it('should not deal damage when card has no Damage bonus', function () {
            this.bindingIrons.cardData.enhancements = ['damage', 'damage'];

            this.player1.play(this.guiltyHearts);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(1);
        });

        it('should deal 1D + 1D when selecting an enemy creature', function () {
            this.bindingIrons.cardData.enhancements = ['damage', 'damage'];

            this.player1.play(this.bindingIrons);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.maleficorn);
            expect(this.player1).toBeAbleToSelect(this.brammo);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            this.player1.clickCard(this.alaka);
            expect(this.alaka.tokens.damage).toBe(2);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.maleficorn);
            expect(this.player1).toBeAbleToSelect(this.brammo);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            this.player1.clickCard(this.brammo);
            expect(this.brammo.tokens.damage).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not deal extra damage when selecting a friendly creature', function () {
            this.bindingIrons.cardData.enhancements = ['damage', 'damage'];

            this.player1.play(this.bindingIrons);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.maleficorn);
            expect(this.player1).toBeAbleToSelect(this.brammo);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.maleficorn);
            expect(this.player1).toBeAbleToSelect(this.brammo);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not deal extra damage when damage is not from bonus', function () {
            this.player1.play(this.gongoozle);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.maleficorn);
            expect(this.player1).toBeAbleToSelect(this.brammo);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            this.player1.clickCard(this.brammo);
            expect(this.brammo.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal 1D + 1D when opponent target their own creature', function () {
            this.burnTheStockpile.cardData.enhancements = ['damage'];
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.burnTheStockpile);
            expect(this.player2).toBeAbleToSelect(this.troll);
            expect(this.player2).toBeAbleToSelect(this.maleficorn);
            expect(this.player2).toBeAbleToSelect(this.brammo);
            expect(this.player2).toBeAbleToSelect(this.alaka);
            this.player2.clickCard(this.alaka);
            expect(this.alaka.tokens.damage).toBe(2);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not deal 1D when opponent target my creature', function () {
            this.burnTheStockpile.cardData.enhancements = ['damage'];
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.burnTheStockpile);
            expect(this.player2).toBeAbleToSelect(this.troll);
            expect(this.player2).toBeAbleToSelect(this.maleficorn);
            expect(this.player2).toBeAbleToSelect(this.brammo);
            expect(this.player2).toBeAbleToSelect(this.alaka);
            this.player2.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
