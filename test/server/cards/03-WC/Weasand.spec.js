describe('Weasand', function () {
    describe("Weasand's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['dodger', 'redlock'],
                    hand: ['weasand']
                },
                player2: {
                    inPlay: ['drummernaut'],
                    hand: ['thorium-plasmate']
                }
            });
        });

        it('should not gain amber if opponent does not forge a key', function () {
            this.player1.playCreature(this.weasand, true, true);
            this.player1.clickCard(this.redlock);
            expect(this.weasand.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player1.amber).toBe(0);
        });

        it('should not gain amber if player does not forge a key', function () {
            this.player1.playCreature(this.weasand, true, true);
            this.player1.clickCard(this.redlock);
            expect(this.weasand.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
        });

        it('should gain 2 amber if opponent forges a key', function () {
            this.player2.amber = 6;
            this.player1.playCreature(this.weasand, true, true);
            this.player1.clickCard(this.redlock);
            expect(this.weasand.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('Red');
            this.player2.clickPrompt('brobnar');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });

        it('should gain 2 amber after forging a key', function () {
            this.player1.amber = 6;
            this.player1.playCreature(this.weasand, true, true);
            this.player1.clickCard(this.redlock);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('Red');
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });

        it('should be destroyed if on a flank right after play', function () {
            this.player1.playCreature(this.weasand);
            expect(this.weasand.location).toBe('discard');
        });

        it('should be destroyed if on a flank after a fight', function () {
            this.player1.playCreature(this.weasand, true, true);
            this.player1.clickCard(this.redlock);
            expect(this.weasand.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.drummernaut, this.redlock);
            expect(this.redlock.location).toBe('discard');
            expect(this.weasand.location).toBe('discard');
        });

        it('should be destroyed even if warded', function () {
            this.player1.playCreature(this.weasand, true, true);
            this.player1.clickCard(this.redlock);
            this.weasand.ward();
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.drummernaut, this.redlock);
            expect(this.redlock.location).toBe('discard');
            expect(this.weasand.location).toBe('discard');
        });

        it('should be destroyed after moved in the battleline', function () {
            this.player1.playCreature(this.weasand, true, true);
            this.player1.clickCard(this.redlock);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.thoriumPlasmate);
            expect(this.player2).toHavePrompt('Choose a creature');
            this.player2.clickCard(this.dodger);
            expect(this.player2).toHavePrompt('Select a card to move this card next to');
            this.player2.clickCard(this.weasand);
            expect(this.player2).toHavePrompt('Which side to you want to move this card to?');
            this.player2.clickPrompt('Right');
            expect(this.dodger.tokens.damage).toBe(2);
            expect(this.dodger.location).toBe('play area');
            expect(this.weasand.location).toBe('discard');
        });
    });

    describe("Weasand's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['lamindra', 'redlock'],
                    hand: ['weasand']
                },
                player2: {
                    inPlay: ['bulwark'],
                    hand: ['armageddon-cloak']
                }
            });
        });

        it('should be destroyed even with armageddon cloack', function () {
            this.player1.playCreature(this.weasand, true, true);
            this.player1.clickCard(this.redlock);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.playUpgrade(this.armageddonCloak, this.weasand);
            this.player2.fightWith(this.bulwark, this.redlock);
            expect(this.redlock.location).toBe('discard');
            expect(this.weasand.location).toBe('discard');
            expect(this.armageddonCloak.location).toBe('discard');
        });
    });

    describe("Weasand's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['lamindra', 'flaxia', 'redlock', 'creed-of-nurture'],
                    hand: ['weasand', 'bumblebird']
                },
                player2: {
                    inPlay: ['bulwark'],
                    hand: ['armageddon-cloak']
                }
            });
        });

        it('should destroy creature on flank if choose to reveal Weasand using Creed', function () {
            this.player1.useAction(this.creedOfNurture, true);
            expect(this.player1).toBeAbleToSelect(this.weasand);
            this.player1.clickCard(this.weasand);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.flaxia.location).toBe('play area');
            expect(this.redlock.location).toBe('play area');
            expect(this.weasand.location).toBe('hand');
        });

        it('should not destroy creature at center if choose to reveal Weasand using Creed', function () {
            this.player1.useAction(this.creedOfNurture, true);
            expect(this.player1).toBeAbleToSelect(this.weasand);
            this.player1.clickCard(this.weasand);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('play area');
            expect(this.flaxia.getKeywordValue('elusive')).toBe(2);
            expect(this.redlock.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.weasand.location).toBe('hand');
        });
    });
});
