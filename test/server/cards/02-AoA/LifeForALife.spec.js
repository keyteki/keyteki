describe('Life for a Life', function () {
    describe("Life for a Life's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['life-for-a-life'],
                    inPlay: ['dust-pixie', 'mushroom-man', 'ancient-bear']
                },
                player2: {
                    inPlay: ['tunk', 'troll']
                }
            });
        });

        it('should destroy a friendly creature to deal 6 damage to a creature', function () {
            this.player1.play(this.lifeForALife);

            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.mushroomMan);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.dustPixie);

            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.mushroomMan);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);

            expect(this.mushroomMan.damage).toBe(0);
            expect(this.ancientBear.damage).toBe(0);
            expect(this.tunk.damage).toBe(0);
            expect(this.troll.damage).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
