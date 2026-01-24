describe('Overlord Greking', function () {
    describe("Overlord Greking's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    hand: ['werewolf-curse', 'ultra-gravitron', 'ultra-gravitron2'],
                    inPlay: ['overlord-greking', 'dominator-bauble']
                },
                player2: {
                    amber: 3,
                    hand: ['ultra-gravitron', 'ultra-gravitron2', 'collar-of-subordination'],
                    inPlay: ['mother', 'troll', 'batdrone', 'dextre', 'groke']
                }
            });
            this.werewolfCurse.maverick = true;
            this.werewolfCurse.printedHouse = 'dis';
            this.collarOfSubordination.maverick = true;
            this.collarOfSubordination.printedHouse = 'logos';
            this.ultraGravitronA1 = this.player1.hand[1];
            this.ultraGravitronA2 = this.player1.hand[2];
            this.ultraGravitronB1 = this.player2.hand[0];
            this.ultraGravitronB2 = this.player2.hand[1];
        });

        it("should put a destroyed creature into play under the controller's control", function () {
            this.player1.fightWith(this.overlordGreking, this.mother);
            expect(this.overlordGreking.damage).toBe(5);
            expect(this.mother.hasToken('damage')).toBe(false);
            expect(this.mother.location).toBe('discard');
            expect(this.player1).toHavePrompt('mother');
            this.player1.clickPrompt('Left');
            expect(this.mother.location).toBe('play area');
            expect(this.mother.controller).toBe(this.player1.player);
            expect(this.player1.player.cardsInPlay).toContain(this.mother);
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(7);
        });

        it('should be able to use the controller creature', function () {
            this.player1.fightWith(this.overlordGreking, this.batdrone);
            expect(this.overlordGreking.damage).toBe(2);
            expect(this.batdrone.hasToken('damage')).toBe(false);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).toHavePrompt('batdrone');
            this.player1.clickPrompt('Left');
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.controller).toBe(this.player1.player);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.fightWith(this.batdrone, this.troll);
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.hasToken('damage')).toBe(false);
            expect(this.troll.damage).toBe(2);
        });

        it('should make the controlled creature die as normal', function () {
            this.player1.fightWith(this.overlordGreking, this.mother);
            this.player1.clickPrompt('Left');
            this.mother.ready();
            expect(this.player1.player.cardsInPlay).toContain(this.mother);
            expect(this.player2.player.discard).not.toContain(this.mother);
            this.player1.clickCard(this.dominatorBauble);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickCard(this.mother);
            expect(this.player1).toHavePrompt('Mother');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(5);
            expect(this.mother.location).toBe('discard');
            expect(this.mother.controller).toBe(this.player2.player);
            expect(this.player2.player.discard).toContain(this.mother);
        });

        it('should not work on Dextre', function () {
            this.player1.fightWith(this.overlordGreking, this.dextre);
            expect(this.overlordGreking.damage).toBe(3);
            expect(this.dextre.hasToken('damage')).toBe(false);
            expect(this.dextre.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
            expect(this.dextre.controller).toBe(this.player2.player);
        });

        it('should not trigger fight effects of attacker (Groke)', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.groke, this.overlordGreking);
            this.player2.clickPrompt('Left');
            expect(this.player1.player.cardsInPlay).toContain(this.groke);
            expect(this.player2.player.discard).not.toContain(this.groke);
            expect(this.groke.damage).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('should put into play creatures killed with splash', function () {
            this.player1.playUpgrade(this.werewolfCurse, this.overlordGreking);
            this.mother.tokens.damage = 2;
            this.troll.tokens.damage = 1;
            this.overlordGreking.tokens.ward = 1;
            this.player1.fightWith(this.overlordGreking, this.troll);
            this.player1.clickCard(this.batdrone);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.mother);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Right');
            expect(this.mother.location).toBe('play area');
            expect(this.mother.controller).toBe(this.player1.player);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.controller).toBe(this.player1.player);
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not put into play two gigantic creatures killed with splash', function () {
            // Player 1 plays Ultra Gravitron A and Player 2 takes control of it
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.playCreature(this.ultraGravitronA1);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            expect(this.ultraGravitronA1.controller).toBe(this.player1.player);
            this.player2.playUpgrade(this.collarOfSubordination, this.ultraGravitronA1);
            this.player2.clickPrompt('Right');

            // Player 2 plays Ultra Gravitron B
            this.player2.playCreature(this.ultraGravitronB1);
            expect(this.ultraGravitronA1.controller).toBe(this.player2.player);
            expect(this.ultraGravitronB1.controller).toBe(this.player2.player);
            this.player2.endTurn();

            // Set up Ultra Gravitrons to be killed by Overlord Greking and Splash
            this.player1.clickPrompt('dis');
            this.player1.clickPrompt('No');
            this.ultraGravitronA1.tokens.damage = 9;
            this.ultraGravitronB1.tokens.damage = 3;
            this.overlordGreking.tokens.ward = 1;
            this.player1.fightWith(this.overlordGreking, this.ultraGravitronB1);
            this.overlordGreking.exhausted = false;
            this.overlordGreking.tokens.ward = 1;
            this.player1.playUpgrade(this.werewolfCurse, this.overlordGreking);

            // Fight and destroy both Ultra Gravitrons
            this.player1.fightWith(this.overlordGreking, this.ultraGravitronA1);
            // Select and then fizzle
            this.player1.clickCard(this.ultraGravitronA1);

            // Overlord Greking's ability can only play 1 card at a time, and therefore cannot put a gigantic creature into play - it effectively has 2 allowances to play 1 card from killing both gigantics with splash - not 1 allowance to play 2 cards a la Saurian Egg
            expect(this.ultraGravitronA1.location).toBe('discard');
            expect(this.ultraGravitronA2.location).toBe('discard');
            expect(this.ultraGravitronB1.location).toBe('discard');
            expect(this.ultraGravitronB2.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
