describe('Nagoo Yani', function () {
    describe("Nagoo Yani's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['nagoo-yani'],
                    inPlay: ['dew-faerie', 'dust-pixie']
                },
                player2: {
                    inPlay: ['lamindra', 'nexus', 'troll']
                }
            });
        });

        it('should deal 4 damage to an enemy creature on play', function () {
            this.player1.play(this.nagooYani);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deal 4 damage to an enemy creature on fight', function () {
            this.player1.play(this.nagooYani);
            this.player1.clickCard(this.troll);
            this.nagooYani.ready();
            this.player1.fightWith(this.nagooYani, this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deal 2 damage to enemy flank creatures on scrap', function () {
            this.player1.scrap(this.nagooYani);
            expect(this.lamindra.location).toBe('discard');
            expect(this.troll.damage).toBe(2);
            expect(this.nexus.damage).toBe(0);
            expect(this.dewFaerie.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
