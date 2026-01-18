describe('Overlord Greking', function () {
    describe("Overlord Greking's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    hand: ['werewolf-curse'],
                    inPlay: ['overlord-greking', 'dominator-bauble']
                },
                player2: {
                    amber: 3,
                    hand: [
                        'ultra-gravitron',
                        'ultra-gravitron2',
                        'ultra-gravitron',
                        'ultra-gravitron2'
                    ],
                    inPlay: ['mother', 'troll', 'batdrone', 'dextre', 'groke']
                }
            });
            this.werewolfCurse.maverick = true;
            this.werewolfCurse.printedHouse = 'dis';
            this.ultraGravitronA1 = this.player2.hand[0];
            this.ultraGravitronA2 = this.player2.hand[1];
            this.ultraGravitronB1 = this.player2.hand[2];
            this.ultraGravitronB2 = this.player2.hand[3];
        });

        it("should put a destroyed creature into play under the controller's control", function () {
            this.player1.fightWith(this.overlordGreking, this.mother);
            expect(this.overlordGreking.tokens.damage).toBe(5);
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
            expect(this.overlordGreking.tokens.damage).toBe(2);
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
            expect(this.troll.tokens.damage).toBe(2);
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
            expect(this.troll.tokens.damage).toBe(5);
            expect(this.mother.location).toBe('discard');
            expect(this.mother.controller).toBe(this.player2.player);
            expect(this.player2.player.discard).toContain(this.mother);
        });

        it('should not work on Dextre', function () {
            this.player1.fightWith(this.overlordGreking, this.dextre);
            expect(this.overlordGreking.tokens.damage).toBe(3);
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
            expect(this.groke.tokens.damage).toBeUndefined();
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
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.playCreature(this.ultraGravitronA1);
            this.player2.clickCard(this.ultraGravitronA2); // Choose other half
            this.player2.clickPrompt('Right');
            this.player2.playCreature(this.ultraGravitronB1);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.ultraGravitronA1.tokens.damage = 9;
            this.ultraGravitronB1.tokens.damage = 3;
            this.overlordGreking.tokens.ward = 1;
            this.player1.fightWith(this.overlordGreking, this.ultraGravitronB1);
            this.overlordGreking.exhausted = false;
            this.overlordGreking.tokens.ward = 1;
            this.player1.playUpgrade(this.werewolfCurse, this.overlordGreking);
            // Destroys both gigantic creatures
            this.player1.fightWith(this.overlordGreking, this.ultraGravitronA1);
            this.player1.clickCard(this.ultraGravitronA1); // Select and then fizzle
            // Overlord Greking's ability can only play 1 card at a time, and therefore cannot put a gigantic creature into play, even if it has 2 allowances from killing both gigantics with splash.
            expect(this.ultraGravitronA1.location).toBe('discard');
            expect(this.ultraGravitronA2.location).toBe('discard');
            expect(this.ultraGravitronB1.location).toBe('discard');
            expect(this.ultraGravitronB2.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
