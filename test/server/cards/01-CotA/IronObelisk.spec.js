describe('Iron Obelisk', function () {
    describe("Iron Obelisk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['anger', 'hebe-the-huge'],
                    inPlay: ['iron-obelisk', 'troll', 'valdr', 'bumpsy', 'sequis']
                },
                player2: {
                    amber: 9,
                    inPlay: [
                        'batdrone',
                        'dextre',
                        'doc-bookton',
                        'ganymede-archivist',
                        'ganger-chieftain'
                    ]
                }
            });
        });

        it("shouldn't affect key cost when no creatures are damaged", function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(3);
        });

        it("shouldn't affect key cost when non-brobnar creatures or enemy brobnar creatures are damaged", function () {
            this.player1.play(this.anger);
            this.player1.clickCard(this.sequis);
            this.player1.clickCard(this.gangerChieftain);
            expect(this.sequis.hasToken('damage')).toBe(true);
            expect(this.gangerChieftain.hasToken('damage')).toBe(true);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(3);
        });

        it('should reduce key cost by one if there is a single damaged friendly brobnar creature', function () {
            this.player1.fightWith(this.valdr, this.dextre);
            expect(this.valdr.hasToken('damage')).toBe(true);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(2);
        });

        it('should prevent forging a key if the cost is high enough', function () {
            this.player1.play(this.hebeTheHuge);
            expect(this.troll.hasToken('damage')).toBe(true);
            expect(this.valdr.hasToken('damage')).toBe(true);
            expect(this.bumpsy.hasToken('damage')).toBe(true);
            expect(this.hebeTheHuge.hasToken('damage')).toBe(false);
            this.player1.play(this.anger);
            this.player1.clickCard(this.hebeTheHuge);
            this.player1.clickCard(this.docBookton);
            expect(this.hebeTheHuge.hasToken('damage')).toBe(true);
            this.player1.endTurn();
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(9);
        });
    });
});
