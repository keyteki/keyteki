describe('Kaipo', function () {
    describe("Kaipo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['silvertooth', 'knuckler', 'kaipo', 'paralysis-synan']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it("fully heals each of Kaipo's neighbors at the end of the turn", function () {
            this.silvertooth.damage = 1;
            this.knuckler.damage = 1;
            this.kaipo.damage = 1;
            this.paralysisSynan.damage = 2;
            this.troll.damage = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.silvertooth.damage).toBe(1);
            expect(this.knuckler.damage).toBe(0);
            expect(this.kaipo.damage).toBe(1);
            expect(this.paralysisSynan.damage).toBe(0);
            expect(this.troll.damage).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not trigger on opponent end of turn', function () {
            this.silvertooth.damage = 1;
            this.knuckler.damage = 1;
            this.paralysisSynan.damage = 1;
            this.troll.damage = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.silvertooth.damage).toBe(1);
            expect(this.knuckler.damage).toBe(0);
            expect(this.paralysisSynan.damage).toBe(0);
            expect(this.troll.damage).toBe(1);
            this.knuckler.damage = 1;
            this.paralysisSynan.damage = 1;
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.silvertooth.damage).toBe(1);
            expect(this.knuckler.damage).toBe(1);
            expect(this.paralysisSynan.damage).toBe(1);
            expect(this.troll.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
