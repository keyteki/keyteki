describe('Brain Eater', function () {
    describe("Brain Eater's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['brain-eater', 'bull-wark'],
                    hand: ['garcia-s-blaster']
                },
                player2: {
                    inPlay: [
                        'chronus',
                        'eyegor',
                        'harbinger-of-doom',
                        'dark-minion',
                        'groupthink-tank'
                    ]
                }
            });
        });

        it('should draw a card when it attacks and destroys a creature', function () {
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.brainEater, this.chronus);
            expect(this.chronus.location).toBe('discard');
            expect(this.brainEater.tokens.damage).toBe(3);
            expect(this.player1.hand.length).toBe(handSize + 1);
        });

        it('should draw a card when it is attacked and the attacker is destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            let handSize = this.player1.hand.length;
            this.player2.fightWith(this.chronus, this.brainEater);
            expect(this.chronus.location).toBe('discard');
            expect(this.brainEater.tokens.damage).toBe(3);
            expect(this.player1.hand.length).toBe(handSize + 1);
        });

        it('should not draw a card when it does not kill a creature', function () {
            this.player1.moveCard(this.bullWark, 'discard');
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.brainEater, this.groupthinkTank);
            expect(this.groupthinkTank.location).toBe('play area');
            expect(this.groupthinkTank.tokens.damage).toBe(3);
            expect(this.brainEater.tokens.damage).toBe(4);
            expect(this.player1.hand.length).toBe(handSize);
        });

        it('should not draw a card when it does not kill a creature due to ward', function () {
            this.chronus.ward();
            this.player1.moveCard(this.bullWark, 'discard');
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.brainEater, this.chronus);
            expect(this.chronus.location).toBe('play area');
            expect(this.chronus.tokens.damage).toBeUndefined();
            expect(this.brainEater.tokens.damage).toBe(3);
            expect(this.player1.hand.length).toBe(handSize);
        });

        it('should not draw a card when it kills by assault', function () {
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.brainEater, this.eyegor);
            expect(this.eyegor.location).toBe('discard');
            expect(this.brainEater.tokens.damage).toBeUndefined();
            expect(this.player1.hand.length).toBe(handSize);
        });

        it('should not draw a card when it kills by fight effects', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.playUpgrade(this.garciaSBlaster, this.brainEater);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');

            this.player1.moveCard(this.bullWark, 'discard');
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.brainEater, this.groupthinkTank);
            this.player1.clickCard(this.brainEater);
            this.player1.clickPrompt('Deal 2 damage');
            this.player1.clickCard(this.groupthinkTank);
            expect(this.groupthinkTank.location).toBe('discard');
            expect(this.brainEater.tokens.damage).toBe(4);
            expect(this.player1.hand.length).toBe(handSize);
        });

        it('should happen after destroyed effects', function () {
            this.player1.moveCard(this.bullWark, 'discard');
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.brainEater, this.darkMinion);
            expect(this.player1).isReadyToTakeAction();
            expect(this.darkMinion.location).toBe('discard');
            expect(this.brainEater.tokens.damage).toBe(2);
            expect(this.player1.hand.length).toBe(handSize + 1);
        });

        it('should be destroyed when fighting harbinger', function () {
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.brainEater, this.harbingerOfDoom);
            expect(this.harbingerOfDoom.location).toBe('discard');
            expect(this.brainEater.location).toBe('discard');
            expect(this.player1.hand.length).toBe(handSize);
        });
    });
});
