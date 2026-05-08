describe('Shard of Courage', function () {
    describe("Shard of Courage's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['shard-of-courage', 'troll', 'bosun-creen'],
                    discard: ['shard-of-strength']
                },
                player2: {
                    inPlay: ['umbra', 'dust-pixie']
                }
            });
        });

        it('should ready and fight with 1 exhausted creature', function () {
            this.player1.reap(this.bosunCreen);
            this.player1.useAction(this.shardOfCourage);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.bosunCreen);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should ready and fight with 1 ready creature', function () {
            this.player1.reap(this.bosunCreen);
            this.player1.useAction(this.shardOfCourage);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should ready and fight with 2 different creatures', function () {
            this.player1.moveCard(this.shardOfStrength, 'play area');
            this.player1.reap(this.bosunCreen);
            this.player1.useAction(this.shardOfCourage);
            this.player1.clickCard(this.bosunCreen);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.umbra);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.umbra.location).toBe('discard');
            expect(this.bosunCreen.damage).toBe(1);
            expect(this.troll.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should ready and fight with the same creature twice', function () {
            this.player1.moveCard(this.shardOfStrength, 'play area');
            this.player1.reap(this.bosunCreen);
            this.player1.useAction(this.shardOfCourage);
            this.player1.clickCard(this.bosunCreen);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.bosunCreen);
            this.player1.clickCard(this.umbra);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.umbra.location).toBe('discard');
            expect(this.bosunCreen.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
