describe('Void Shields', function () {
    describe("Void Shields's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['void-shields'],
                    inPlay: ['helper-bot']
                },
                player2: {
                    inPlay: ['troll'],
                    hand: ['shadow-of-dis', 'draining-touch']
                }
            });
        });

        it('should cause the creature to be warded at the end of the turn', function () {
            this.player1.playUpgrade(this.voidShields, this.helperBot);
            expect(this.helperBot.warded).toBe(false);
            this.player1.endTurn();
            expect(this.helperBot.warded).toBe(true);
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.helperBot);
            expect(this.helperBot.warded).toBe(false);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            expect(this.helperBot.warded).toBe(false);
            this.player1.endTurn();
            expect(this.helperBot.warded).toBe(true);
        });

        it('should be blanked by Shadow of Dis', function () {
            this.player1.playUpgrade(this.voidShields, this.helperBot);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.play(this.drainingTouch);
            this.player2.clickCard(this.helperBot);
            expect(this.helperBot.warded).toBe(false);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            expect(this.helperBot.warded).toBe(false);
            this.player1.endTurn();
            expect(this.helperBot.warded).toBe(false);
        });
    });
});
