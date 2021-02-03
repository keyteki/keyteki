describe('Censor Philo', function () {
    describe("Censor Phio's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    inPlay: ['bramble-lynx', 'tantadlin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['censor-philo']
                }
            });

            this.tantadlin.tokens.amber = 1;
        });

        it('should not take damage from creature with amber', function () {
            this.player1.fightWith(this.tantadlin, this.censorPhilo);
            expect(this.tantadlin.tokens.damage).toBe(5);
            expect(this.censorPhilo.location).toBe('play area');
            expect(this.censorPhilo.tokens.damage).toBeUndefined();
        });

        it('should take damage from creature without amber', function () {
            this.player1.fightWith(this.brambleLynx, this.censorPhilo);
            expect(this.brambleLynx.location).toBe('play area');
            expect(this.brambleLynx.tokens.damage).toBeUndefined();
            expect(this.censorPhilo.tokens.damage).toBe(3);
        });

        it('should not take damage when fighting against a creature with amber', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.fightWith(this.censorPhilo, this.tantadlin);
            expect(this.tantadlin.tokens.damage).toBe(5);
            expect(this.censorPhilo.location).toBe('play area');
            expect(this.censorPhilo.tokens.damage).toBeUndefined();
        });

        it('should take damage when fighting against a creature without amber', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.fightWith(this.censorPhilo, this.brambleLynx);
            expect(this.brambleLynx.location).toBe('discard');
            expect(this.censorPhilo.tokens.damage).toBe(3);
        });
    });
});
