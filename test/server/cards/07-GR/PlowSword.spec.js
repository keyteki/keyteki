describe('Plow-Sword', function () {
    describe("Plow-Sword's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['flaxia', 'plow-sword'],
                    discard: ['echofly', 'a-strong-feeling']
                },
                player2: {
                    inPlay: ['charette', 'cpo-zytar'],
                    discard: ['control-the-weak', 'medic-ingram']
                }
            });
        });

        it('puts creature in friendly discard on bottom of deck', function () {
            this.player1.useAction(this.plowSword);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.aStrongFeeling);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.controlTheWeak);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.location).toBe('deck');
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(
                this.echofly
            );
        });

        it('does 3 damage to a creature if you moved a creature', function () {
            this.player1.useAction(this.plowSword);
            this.player1.clickCard(this.echofly);
            expect(this.player1).not.toBeAbleToSelect(this.echofly);
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.aStrongFeeling);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.controlTheWeak);
            this.player1.clickCard(this.cpoZytar);
            expect(this.cpoZytar.tokens.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if you did not move a creature', function () {
            this.player1.moveCard(this.echofly, 'deck');
            this.player1.moveCard(this.medicIngram, 'deck');
            this.player1.useAction(this.plowSword);
            this.player1.clickCard(this.echofly);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
