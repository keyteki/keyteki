describe('Hapsis', function () {
    describe("Hapsis' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['hapsis', 'bull-wark'],
                    hand: ['garcia-s-blaster', 'armageddon-cloak']
                },
                player2: {
                    inPlay: [
                        'chronus',
                        'eyegor',
                        'harbinger-of-doom',
                        'dark-minion',
                        'zenzizenzizenzic'
                    ],
                    hand: ['bonerot-venom']
                }
            });
        });

        it('should draw a card when it attacks and destroys a creature', function () {
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.hapsis, this.chronus);
            expect(this.chronus.location).toBe('discard');
            expect(this.hapsis.tokens.damage).toBe(3);
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.hapsis.hasToken('ward')).toBe(true);
        });

        it('should draw a card and ward when it is attacked and the attacker is destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            let handSize = this.player1.hand.length;
            this.player2.fightWith(this.chronus, this.hapsis);
            expect(this.chronus.location).toBe('discard');
            expect(this.hapsis.tokens.damage).toBe(3);
            expect(this.hapsis.hasToken('ward')).toBe(true);
            expect(this.player1.hand.length).toBe(handSize + 1);
        });

        it('should not draw a card when it does not kill a creature', function () {
            this.player1.moveCard(this.bullWark, 'discard');
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.hapsis, this.zenzizenzizenzic);
            expect(this.zenzizenzizenzic.location).toBe('play area');
            expect(this.zenzizenzizenzic.tokens.damage).toBe(3);
            expect(this.hapsis.tokens.damage).toBe(4);
            expect(this.player1.hand.length).toBe(handSize);
            expect(this.hapsis.hasToken('ward')).toBe(false);
        });

        it('should not draw a card when it does not kill a creature due to ward', function () {
            this.chronus.ward();
            this.player1.moveCard(this.bullWark, 'discard');
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.hapsis, this.chronus);
            expect(this.chronus.location).toBe('play area');
            expect(this.chronus.tokens.damage).toBeUndefined();
            expect(this.hapsis.tokens.damage).toBe(3);
            expect(this.player1.hand.length).toBe(handSize);
            expect(this.hapsis.hasToken('ward')).toBe(false);
        });

        it('should not draw a card when it kills by assault', function () {
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.hapsis, this.eyegor);
            expect(this.eyegor.location).toBe('discard');
            expect(this.hapsis.tokens.damage).toBeUndefined();
            expect(this.player1.hand.length).toBe(handSize);
            expect(this.hapsis.hasToken('ward')).toBe(false);
        });

        it('should not draw a card when it kills by fight effects', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.playUpgrade(this.garciaSBlaster, this.hapsis);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');

            this.player1.moveCard(this.bullWark, 'discard');
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.hapsis, this.zenzizenzizenzic);
            this.player1.clickCard(this.hapsis);
            this.player1.clickPrompt('Deal 2 damage');
            this.player1.clickCard(this.zenzizenzizenzic);
            expect(this.zenzizenzizenzic.location).toBe('discard');
            expect(this.hapsis.tokens.damage).toBe(4);
            expect(this.player1.hand.length).toBe(handSize);
            expect(this.hapsis.hasToken('ward')).toBe(false);
        });

        it('should happen after destroyed effects', function () {
            this.player1.moveCard(this.bullWark, 'discard');
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.hapsis, this.darkMinion);
            expect(this.player1).isReadyToTakeAction();
            expect(this.darkMinion.location).toBe('discard');
            expect(this.hapsis.tokens.damage).toBe(2);
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.hapsis.hasToken('ward')).toBe(true);
        });

        it('should be destroyed when fighting harbinger', function () {
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.hapsis, this.harbingerOfDoom);
            expect(this.harbingerOfDoom.location).toBe('discard');
            expect(this.hapsis.location).toBe('discard');
            expect(this.player1.hand.length).toBe(handSize);
        });

        it('should be warded before bonerot venom effect', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playUpgrade(this.bonerotVenom, this.hapsis);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');

            this.player1.moveCard(this.bullWark, 'discard');
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.hapsis, this.eyegor);
            expect(this.eyegor.location).toBe('discard');
            expect(this.hapsis.tokens.damage).toBe(2);
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.hapsis.hasToken('ward')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
