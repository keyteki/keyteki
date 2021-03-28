describe('Disruption Field', function () {
    describe("Disruption Field's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['doctor-driscoll'],
                    hand: ['disruption-field']
                },
                player2: {
                    amber: 9,
                    inPlay: ['lamindra', 'krump', 'troll']
                }
            });
        });

        it("should increase opponent's key cost +1 per disruption token", function () {
            this.player1.playUpgrade(this.disruptionField, this.doctorDriscoll);
            this.disruptionField.tokens.disruption = 2;
            this.player1.endTurn();

            this.player2.forgeKey('red');
            expect(this.player2.amber).toBe(1);
        });

        it('should add +1 disruption counter after reap', function () {
            this.player1.playUpgrade(this.disruptionField, this.doctorDriscoll);
            this.player1.reap(this.doctorDriscoll);
            expect(this.disruptionField.tokens.disruption).toBe(1);
        });

        it('should add +1 disruption counter after fight', function () {
            this.player1.playUpgrade(this.disruptionField, this.doctorDriscoll);
            this.player1.fightWith(this.doctorDriscoll, this.lamindra);
            expect(this.disruptionField.tokens.disruption).toBe(1);
        });

        it('should cleanup tokens when destroyed', function () {
            this.disruptionField.tokens.disruption = 3;
            this.player1.playUpgrade(this.disruptionField, this.doctorDriscoll);
            this.player1.fightWith(this.doctorDriscoll, this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.doctorDriscoll.location).toBe('discard');
            expect(this.disruptionField.location).toBe('discard');
            expect(this.disruptionField.tokens.disruption).toBeUndefined();
        });
    });
});
