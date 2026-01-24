describe('Magistra Vita Evil Twin', function () {
    describe("Magistra Vita Evil Twin's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['shooler', 'senator-shrix'],
                    hand: ['magistra-vita-evil-twin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });

            this.player1.play(this.magistraVitaEvilTwin);
        });

        it('should be optional', function () {
            expect(this.player1).toHavePromptButton('Done');
        });

        it('should be able to exalt and fight a non-saurian friendly creature', function () {
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.magistraVitaEvilTwin);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.shooler);
            this.player1.clickCard(this.murkens);
            expect(this.shooler.tokens.damage).toBe(2);
            expect(this.shooler.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Magistra Vita Evil Twin's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['magistra-vita-evil-twin', 'shooler', 'senator-shrix']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'lamindra']
                }
            });

            this.player1.fightWith(this.magistraVitaEvilTwin, this.murkens);
        });

        it('should be able to exalt and fight a non-saurian friendly creature', function () {
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.magistraVitaEvilTwin);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.shooler);
            this.player1.clickCard(this.murkens);
            expect(this.shooler.tokens.damage).toBe(2);
            expect(this.shooler.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
