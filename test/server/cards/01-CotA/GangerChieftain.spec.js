describe('Ganger Chieftain', function () {
    describe("Ganger Chieftain's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['ganger-chieftain', 'anger', 'ganger-chieftain'],
                    inPlay: ['troll', 'ancient-bear']
                },
                player2: {
                    hand: ['foggify'],
                    inPlay: ['batdrone', 'doc-bookton']
                }
            });
            this.player1.fightWith(this.troll, this.docBookton);
            this.ganger1 = this.player1.hand[0];
            this.ganger2 = this.player1.hand[2];
        });

        it('should allow fighting with an exhausted creature', function () {
            expect(this.troll.exhausted).toBe(true);
            expect(this.docBookton.location).toBe('discard');
            this.player1.playCreature(this.gangerChieftain, true);
            this.player1.clickCard(this.gangerChieftain);
            expect(this.player1).toHavePrompt('Ganger Chieftain');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.batdrone);
            expect(this.troll.exhausted).toBe(true);
            expect(this.batdrone.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(7);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow fighting with a non-house creature', function () {
            this.player1.play(this.gangerChieftain);
            this.player1.clickCard(this.gangerChieftain);
            expect(this.player1).toHavePrompt('Ganger Chieftain');
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.ancientBear);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(5);
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.ancientBear.hasToken('damage')).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should ready creatures who can't fight", function () {
            this.player1.play(this.anger);
            this.player1.clickCard(this.ancientBear);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            this.player1.playCreature(this.gangerChieftain, true);
            this.player1.clickCard(this.gangerChieftain);
            expect(this.player1).toHavePrompt('Ganger Chieftain');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
    describe("Ganger Chieftain's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['foggify'],
                    inPlay: ['batdrone', 'doc-bookton']
                },
                player2: {
                    hand: ['ganger-chieftain', 'anger', 'ganger-chieftain'],
                    inPlay: ['troll']
                }
            });
            this.ganger1 = this.player2.hand[0];
            this.ganger2 = this.player2.hand[2];
        });
        it('should respect the rules of cards like foggify', function () {
            this.player1.play(this.foggify);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.troll);
            expect(this.troll.exhausted).toBe(true);
            this.player2.playCreature(this.ganger1, true);
            this.player2.clickCard(this.ganger1);
            expect(this.player2).toHavePrompt('Ganger Chieftain');
            expect(this.player2).toBeAbleToSelect(this.troll);
            expect(this.player2).not.toBeAbleToSelect(this.ganger1);
            expect(this.player2).not.toBeAbleToSelect(this.docBookton);
            this.player2.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(false);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            this.player2.playCreature(this.ganger2, true);
            this.player2.clickCard(this.ganger2);
            expect(this.player2).toHavePrompt('Ganger Chieftain');
            expect(this.player2).not.toBeAbleToSelect(this.troll);
            expect(this.player2).not.toBeAbleToSelect(this.ganger2);
            expect(this.player2).toBeAbleToSelect(this.ganger1);
            this.player2.clickCard(this.ganger1);
            expect(this.ganger1.exhausted).toBe(false);
            this.player2.clickCard(this.ganger1);
            expect(this.player2).toHavePrompt('Choose an ability:');
            expect(this.player2).toHavePromptButton('Reap with this creature');
            this.player2.clickPrompt('Reap With This Creature');
            expect(this.player2.amber).toBe(2);
        });
    });
});
