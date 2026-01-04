describe("Namel's Confession", function () {
    describe("Namel's Confession's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    hand: ['namel-s-confession'],
                    inPlay: ['ember-imp', 'troll', 'picaroon', 'shock-herder']
                },
                player2: {
                    amber: 4,
                    inPlay: ['ancient-bear', 'dust-pixie']
                }
            });
        });

        it('should destroy a friendly creature and gain amber equal to half its power', function () {
            this.player1.play(this.namelSConfession);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.shockHerder);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1.amber).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should round down', function () {
            this.player1.play(this.namelSConfession);
            this.player1.clickCard(this.shockHerder);
            expect(this.shockHerder.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber if no creature is destroyed', function () {
            this.player1.moveCard(this.emberImp, 'discard');
            this.player1.moveCard(this.shockHerder, 'discard');
            this.player1.moveCard(this.troll, 'discard');
            this.player1.play(this.namelSConfession);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work on Picaroon', function () {
            this.player1.play(this.namelSConfession);
            expect(this.player1).toBeAbleToSelect(this.picaroon);
            this.player1.clickCard(this.picaroon);
            expect(this.picaroon.location).toBe('discard');
            expect(this.player1.amber).toBe(8);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
