describe('Lucky Dice', function () {
    describe("Lucky Dice's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['lucky-dice', 'lamindra', 'dodger', 'mutant-cutpurse'],
                    amber: 1
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'bingle-bangbang', 'gamgee', 'charette'],
                    hand: ['brammo', 'ballcano', 'sneklifter', 'poltergeist']
                }
            });
        });

        it('should not prevent damage during owner turn', function () {
            this.player1.useAction(this.luckyDice, true);
            expect(this.luckyDice.location).toBe('discard');
            this.player1.fightWith(this.dodger, this.bingleBangbang);
            expect(this.dodger.damage).toBe(2);
        });

        it("should prevent damage during opponent's turn", function () {
            this.player1.useAction(this.luckyDice, true);
            expect(this.luckyDice.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.ballcano);
            this.player2.play(this.brammo);
            expect(this.bingleBangbang.location).toBe('discard');
            expect(this.troll.damage).toBe(4);
            expect(this.lamindra.location).toBe('play area');
            expect(this.dodger.location).toBe('play area');
            expect(this.mutantCutpurse.location).toBe('play area');
            expect(this.lamindra.damage).toBe(0);
            expect(this.dodger.damage).toBe(0);
            expect(this.mutantCutpurse.damage).toBe(0);
        });

        it('should last for one round only', function () {
            this.player1.useAction(this.luckyDice, true);
            expect(this.luckyDice.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.ballcano);
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.fightWith(this.dodger, this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.dodger.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.brammo);
            expect(this.lamindra.location).toBe('discard');
            expect(this.mutantCutpurse.damage).toBe(2);
        });

        it('should work when taken control', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.sneklifter);
            this.player2.clickCard(this.luckyDice);
            this.player2.useAction(this.luckyDice, true);
            expect(this.luckyDice.location).toBe('discard');
            this.player2.fightWith(this.gamgee, this.mutantCutpurse);
            expect(this.gamgee.location).toBe('discard');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.fightWith(this.dodger, this.troll);
            expect(this.dodger.location).toBe('discard');
            expect(this.troll.damage).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.ballcano);
            expect(this.troll.damage).toBe(4);
        });

        it('should work with Poltergeist', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.poltergeist);
            this.player2.clickCard(this.luckyDice);
            expect(this.luckyDice.location).toBe('discard');
            this.player2.fightWith(this.charette, this.mutantCutpurse);
            expect(this.charette.damage).toBe(3);
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.fightWith(this.dodger, this.troll);
            expect(this.dodger.location).toBe('discard');
            expect(this.troll.damage).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.ballcano);
            expect(this.troll.damage).toBe(4);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'staralliance',
                    hand: ['subdue'],
                    inPlay: ['tachyon-manifold', 'lucky-dice', 'sensor-chief-garcia']
                },
                player2: {
                    amber: 0,
                    inPlay: ['dust-pixie'],
                    hand: ['particle-sweep']
                }
            });
            this.tachyonManifold.maverick = 'staralliance';
            this.tachyonManifold.printedHouse = 'staralliance';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should only affect opponent's next turn", function () {
            this.player1.useAction(this.luckyDice, true);
            expect(this.sensorChiefGarcia.damage).toBe(0);
            this.player1.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.play(this.subdue);
            this.player1.clickCard(this.sensorChiefGarcia);
            expect(this.sensorChiefGarcia.damage).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.play(this.particleSweep);
            this.player2.clickCard(this.sensorChiefGarcia);
            expect(this.sensorChiefGarcia.damage).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
