describe('J43G3R V', function () {
    describe("J43G3R V's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['j43g3r-v', 'j43g3r-v2'],
                    inPlay: ['flaxia', 'mushroom-man', 'dust-pixie', 'sensor-chief-garcia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra', 'umbra']
                }
            });
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.j43g3rV2, 'discard');
            this.player1.clickCard(this.j43g3rV);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.j43g3rV, 'discard');
            this.player1.clickCard(this.j43g3rV2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 1', function () {
            this.player1.clickCard(this.j43g3rV);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.j43g3rV2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to reap with 2 non-SA creatures this turn on reap', function () {
            this.player1.playCreature(this.j43g3rV);
            this.j43g3rV.exhausted = false;
            this.player1.clickCard(this.flaxia);
            this.expectReadyToTakeAction(this.player1);

            this.player1.reap(this.j43g3rV);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(3);
            this.player1.reap(this.sensorChiefGarcia);
            this.player1.reap(this.dustPixie);
            expect(this.player1.amber).toBe(5);
            this.player1.clickCard(this.mushroomMan);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should be able to fight with 2 non-SA creatures this turn on fight', function () {
            this.player1.playCreature(this.j43g3rV);
            this.j43g3rV.exhausted = false;
            this.player1.clickCard(this.flaxia);
            this.expectReadyToTakeAction(this.player1);

            this.player1.fightWith(this.j43g3rV, this.umbra);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('discard');
            this.player1.fightWith(this.sensorChiefGarcia, this.lamindra);
            this.player1.fightWith(this.dustPixie, this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            this.player1.clickCard(this.mushroomMan);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should be able to stack both effect types', function () {
            this.player1.playCreature(this.j43g3rV);
            this.j43g3rV.exhausted = false;
            this.player1.reap(this.j43g3rV);
            this.j43g3rV.exhausted = false;
            this.player1.fightWith(this.j43g3rV, this.umbra);

            this.player1.clickCard(this.flaxia);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(3);
            this.player1.fightWith(this.dustPixie, this.lamindra);
            this.player1.clickCard(this.mushroomMan);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
