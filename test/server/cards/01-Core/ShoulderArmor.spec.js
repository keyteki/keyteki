describe('Shoulder Armor', function () {
    describe("Shoulder Armor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['numquid-the-fair', 'commander-remiel'],
                    hand: ['shoulder-armor', 'jehu-the-bureaucrat']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should give +2 power and +2 armor when creature is on a flank', function () {
            this.player1.playUpgrade(this.shoulderArmor, this.commanderRemiel);
            expect(this.commanderRemiel.power).toBe(5);
            expect(this.commanderRemiel.armor).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not give bonus when creature is not on a flank', function () {
            this.player1.playCreature(this.jehuTheBureaucrat);
            this.player1.playUpgrade(this.shoulderArmor, this.commanderRemiel);
            expect(this.commanderRemiel.power).toBe(3);
            expect(this.commanderRemiel.armor).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should give bonus when creature becomes a flank creature', function () {
            this.player1.playCreature(this.jehuTheBureaucrat);
            this.player1.playUpgrade(this.shoulderArmor, this.commanderRemiel);
            expect(this.commanderRemiel.power).toBe(3);
            expect(this.commanderRemiel.armor).toBe(0);

            // Destroy the creature on one side to put Commander Remiel on flank
            this.player1.fightWith(this.numquidTheFair, this.troll);
            expect(this.commanderRemiel.power).toBe(5);
            expect(this.commanderRemiel.armor).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
