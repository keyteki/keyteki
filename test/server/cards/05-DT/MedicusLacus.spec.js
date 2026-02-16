describe('MedicusLacus', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                amber: 4,
                house: 'saurian',
                inPlay: ['medicus-lacus', 'grimlocus-dux', 'troll']
            },
            player2: {
                inPlay: ['the-sting', 'lamindra']
            }
        });
        this.troll.amber = 4;
        this.lamindra.amber = 8;
    });

    describe('With High Tide', function () {
        beforeEach(function () {
            this.player1.raiseTide();
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
        });

        describe('with another creature', function () {
            it('should allow spending amber from all friendly creatures', function () {
                expect(this.player1).toHavePrompt(
                    'How much amber do you want to spend from Troll?'
                );
                this.player1.clickPrompt('4');
                expect(this.player1).toHavePrompt('Which key would you like to forge?');
                this.player1.forgeKey('Red');
                expect(this.player1.amber).toBe(2);
            });
        });
    });

    describe('With High Tide', function () {
        beforeEach(function () {
            this.player1.raiseTide();
            this.player1.endTurn();
        });

        it('should not allow opponent to spend amber from their creature', function () {
            expect(this.player2).not.toHavePrompt(
                'How much amber do you want to use from Lamindra?'
            );
            this.player2.clickPrompt('shadows');
            expect(this.lamindra.amber).toBe(8);
        });
    });

    describe('With No Tide', function () {
        beforeEach(function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
        });

        it('should not allow opponent to spend amber from their creature', function () {
            expect(this.player1).not.toHavePrompt('How much amber do you want to use from Troll?');
            this.player1.clickPrompt('saurian');
            expect(this.troll.amber).toBe(4);
            expect(this.player1.amber).toBe(4);
        });
    });

    describe('With Low Tide', function () {
        beforeEach(function () {
            this.player1.lowerTide();
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
        });

        it('should not allow opponent to spend amber from their creature', function () {
            expect(this.player1).not.toHavePrompt('How much amber do you want to use from Troll?');
            this.player1.clickPrompt('saurian');
            expect(this.troll.amber).toBe(4);
            expect(this.player1.amber).toBe(4);
        });
    });
});
