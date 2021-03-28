describe('Hadron Collision', function () {
    describe("Hadron Collision's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['explo-rover', 'medic-ingram'],
                    hand: ['hadron-collision']
                },
                player2: {
                    inPlay: ['senator-shrix', 'abond-the-armorsmith', 'commander-remiel']
                }
            });

            this.senatorShrix.tokens.ward = 1;
        });

        it('should be able to deal damage and kill a creature regardless of armor', function () {
            expect(this.commanderRemiel.armor).toBe(1);
            this.player1.play(this.hadronCollision);
            expect(this.player1).toBeAbleToSelect(this.exploRover);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.abondTheArmorsmith);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            this.player1.clickCard(this.commanderRemiel);
            expect(this.commanderRemiel.location).toBe('discard');
        });

        it('should be able to remove ward and deal damage', function () {
            expect(this.senatorShrix.armor).toBe(2);
            this.player1.play(this.hadronCollision);
            expect(this.player1).toBeAbleToSelect(this.exploRover);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.abondTheArmorsmith);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.location).toBe('play area');
            expect(this.senatorShrix.armor).toBe(2);
            expect(this.senatorShrix.tokens.ward).toBeUndefined();
            expect(this.senatorShrix.tokens.damage).toBe(3);
        });
    });
});
