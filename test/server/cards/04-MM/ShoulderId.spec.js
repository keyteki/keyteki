describe('Shoulder Id', function () {
    describe("Shoulder Id's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'untamed',
                    inPlay: ['fuzzy-gruen', 'tantadlin', 'ancient-bear'],
                    hand: ['way-of-the-porcupine']
                },
                player2: {
                    amber: 4,
                    inPlay: ['shoulder-id']
                }
            });
        });

        it('should not be able to fight', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.clickCard(this.shoulderId);
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
            expect(this.player2).toHavePromptButton('Reap with this creature');
        });

        it('should steal 1 amber instead of dealing defense damage', function () {
            this.player1.fightWith(this.fuzzyGruen, this.shoulderId);
            expect(this.player1).isReadyToTakeAction();
            expect(this.fuzzyGruen.location).toBe('play area');
            expect(this.fuzzyGruen.damage).toBe(0);
            expect(this.shoulderId.damage).toBe(5);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
        });

        it('should steal 2 amber instead of dealing hazardous and defense damage', function () {
            this.player1.playUpgrade(this.wayOfThePorcupine, this.shoulderId);
            this.player1.fightWith(this.fuzzyGruen, this.shoulderId);
            expect(this.player1).isReadyToTakeAction();
            expect(this.fuzzyGruen.location).toBe('play area');
            expect(this.fuzzyGruen.damage).toBe(0);
            expect(this.shoulderId.damage).toBe(5);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(6);
        });

        it('should not steal A if it dies due to Assault', function () {
            this.shoulderId.damage = 5;
            this.player1.fightWith(this.ancientBear, this.shoulderId);
            expect(this.player1).isReadyToTakeAction();
            expect(this.ancientBear.location).toBe('play area');
            expect(this.shoulderId.location).toBe('discard');
            expect(this.ancientBear.damage).toBe(0);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
        });

        it('should steal when attacked by a warded creature, instead of removing the ward', function () {
            this.fuzzyGruen.ward();
            expect(this.fuzzyGruen.warded).toBe(true);
            this.player1.fightWith(this.fuzzyGruen, this.shoulderId);
            expect(this.player1).isReadyToTakeAction();
            expect(this.fuzzyGruen.location).toBe('play area');
            expect(this.fuzzyGruen.warded).toBe(true);
            expect(this.fuzzyGruen.damage).toBe(0);
            expect(this.shoulderId.damage).toBe(5);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
        });
    });
});
