describe('Colossipede', function () {
    describe("Colossipede's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['colossipede'],
                    inPlay: ['helper-bot']
                },
                player2: {
                    amber: 1,
                    inPlay: ['knuckles-bolton']
                }
            });

            this.colossipede.printedHouse = 'logos';
            this.colossipede.maverick = 'logos';
            this.helperBot.amber = 3;
        });

        it('should exalt all creatures on play', function () {
            this.player1.playCreature(this.colossipede);
            expect(this.colossipede.amber).toBe(1);
            expect(this.helperBot.amber).toBe(4);
            expect(this.knucklesBolton.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should give friendly creatures a fight effect to move amber to pool', function () {
            this.player1.playCreature(this.colossipede);
            this.player1.fightWith(this.helperBot, this.knucklesBolton);
            expect(this.helperBot.amber).toBe(0);
            expect(this.player1.amber).toBe(5);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not give enemy creatures a fight effect', function () {
            this.player1.playCreature(this.colossipede);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.knucklesBolton, this.colossipede);
            expect(this.knucklesBolton.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
