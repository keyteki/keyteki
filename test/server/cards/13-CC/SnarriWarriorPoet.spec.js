describe('Snarri, Warrior Poet', function () {
    describe('Snarri, Warrior Poet Ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'brobnar',
                    inPlay: [
                        'brammo',
                        'shorty',
                        'ganger-chieftain',
                        'foozle',
                        'groke',
                        'culf-the-quiet',
                        'snarri-warrior-poet'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['silvertooth', 'gamgee', 'krump', 'troll']
                }
            });
        });

        it('should draw a card after a friendly creature fights', function () {
            const handSize = this.player1.hand.length;
            this.player1.fightWith(this.brammo, this.silvertooth);
            expect(this.player1.hand.length).toBe(handSize + 1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should draw a card after a friendly creature dies in a fight', function () {
            const handSize = this.player1.hand.length;
            this.player1.fightWith(this.brammo, this.troll);
            expect(this.player1.hand.length).toBe(handSize + 1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should draw a card when Snarri itself fights', function () {
            const handSize = this.player1.hand.length;
            this.player1.fightWith(this.snarriWarriorPoet, this.silvertooth);
            expect(this.player1.hand.length).toBe(handSize + 1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not draw a card when Snarri itself dies in a fight', function () {
            const handSize = this.player1.hand.length;
            this.player1.fightWith(this.snarriWarriorPoet, this.troll);
            expect(this.player1.hand.length).toBe(handSize);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not draw when an enemy creature fights', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            const handSize = this.player1.hand.length;
            this.player2.fightWith(this.troll, this.culfTheQuiet);
            expect(this.player1.hand.length).toBe(handSize);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
