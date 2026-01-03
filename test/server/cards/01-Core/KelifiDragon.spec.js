describe('Kelifi Dragon', function () {
    describe("Kelifi Dragon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 7,
                    house: 'brobnar',
                    hand: ['kelifi-dragon'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should be playable with 7+ amber', function () {
            this.player1.playCreature(this.kelifiDragon);
            expect(this.kelifiDragon.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not be playable with less than 7 amber', function () {
            this.player1.amber = 6;
            this.player1.clickCard(this.kelifiDragon);
            expect(this.player1).not.toHavePromptButton('Play');
            expect(this.player1).toHavePromptButton('Discard this card');
            this.player1.clickPrompt('Cancel');
            expect(this.kelifiDragon.location).toBe('hand');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should gain 1 amber and deal 5 damage on reap', function () {
            this.player1.playCreature(this.kelifiDragon);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('Red');
            this.player1.clickPrompt('brobnar');
            this.player1.reap(this.kelifiDragon);
            expect(this.player1).toHavePrompt('Kelifi Dragon');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(5);
            expect(this.player1.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should gain 1 amber and deal 5 damage on fight', function () {
            this.player1.playCreature(this.kelifiDragon);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('Red');
            this.player1.clickPrompt('brobnar');
            this.player1.fightWith(this.kelifiDragon, this.krump);
            expect(this.player1).toHavePrompt('Kelifi Dragon');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(5);
            expect(this.krump.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
