describe('The End Is Nigh', function () {
    describe("The End Is Nigh's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'the-end-is-nigh',
                        'expect-the-unexpected',
                        'bad-omen',
                        'heads-i-win'
                    ],
                    hand: ['parasitic-arachnoid'],
                    inPlay: [
                        'xenos-bloodshadow',
                        'dust-pixie',
                        'mooncurser',
                        'toad',
                        'hunting-witch'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['urchin', 'umbra', 'nexus', 'troll', 'chasm-vespid']
                }
            });
        });

        it('should fulfill when 3 or more creatures are destroyed', function () {
            this.player1.activateProphecy(this.theEndIsNigh, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.urchin, this.xenosBloodshadow);
            this.player2.fightWith(this.umbra, this.xenosBloodshadow);
            this.player2.fightWith(this.nexus, this.xenosBloodshadow);
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should fulfill when 3 or more creatures including by splash-attack', function () {
            this.player1.activateProphecy(this.theEndIsNigh, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.fightWith(this.chasmVespid, this.mooncurser);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.mooncurser.location).toBe('discard');
            expect(this.toad.location).toBe('discard');
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not fulfill when less than 3 creatures are destroyed', function () {
            this.player1.activateProphecy(this.theEndIsNigh, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.urchin, this.xenosBloodshadow);
            this.player2.fightWith(this.umbra, this.xenosBloodshadow);
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not fulfill when a ward prevents the destruction of a creature', function () {
            this.player1.activateProphecy(this.theEndIsNigh, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.nexus, this.xenosBloodshadow);
            this.player2.fightWith(this.umbra, this.xenosBloodshadow);
            this.urchin.ward();
            this.player2.fightWith(this.urchin, this.huntingWitch);
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should reset creature count at the start of each turn', function () {
            this.player1.activateProphecy(this.theEndIsNigh, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.urchin, this.xenosBloodshadow);
            this.player2.fightWith(this.umbra, this.xenosBloodshadow);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.nexus, this.xenosBloodshadow);
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
