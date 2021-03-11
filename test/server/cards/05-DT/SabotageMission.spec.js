describe('Sabotage Mission', function () {
    describe("Sabotage Mission's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['sabotage-mission'],
                    inPlay: [
                        'doctor-driscoll',
                        'armsmaster-molina',
                        'general-xalvador',
                        'lion-bautrem',
                        'gub'
                    ]
                },
                player2: {
                    inPlay: ['shooler', 'dust-imp'],
                    amber: 8
                }
            });
        });

        it('should increase key costs for one turn', function () {
            this.player1.play(this.sabotageMission);
            this.player1.endTurn();

            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            expect(this.player2.player.amber).toBe(8);

            this.player1.clickPrompt('staralliance');
            this.player1.endTurn();

            this.player2.clickPrompt('Blue');
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            expect(this.player2.player.amber).toBe(2);
        });

        it('should increase key costs by 1 for each different power of friendly creatures', function () {
            this.player1.play(this.sabotageMission);
            this.player1.fightWith(this.armsmasterMolina, this.dustImp);
            expect(this.player2.amber).toBe(10);
            this.player1.endTurn();

            this.player2.clickPrompt('Blue');
            this.player2.clickPrompt('dis');
            // battleline: ['doctor-driscoll', 'armsmaster-molina', general-xalvador', 'lion-bautrem', 'gub']
            // powers: [3, 4, 4+2, 4, 1+2] - key cost 9
            expect(this.player2.player.amber).toBe(1);
        });
    });
});
