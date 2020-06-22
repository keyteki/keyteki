describe('Bonerot Venom', function () {
    describe("Bonerot Venom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['bonerot-venom', 'nocturnal-maneuver', 'ganger-chieftain', 'umbra'],
                    inPlay: ['brend-the-fanatic', 'mack-the-knife']
                },
                player2: {
                    house: 'untamed',
                    inPlay: ['mindwarper', 'blypyp'],
                    hand: ['nocturnal-maneuver']
                }
            });
        });

        it('should apply to a creature', function () {
            this.player1.playUpgrade(this.bonerotVenom, this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('play area');
            expect(this.mackTheKnife.upgrades).toContain(this.bonerotVenom);
        });

        it('should deal 2 damage to mack the knife when he reaps', function () {
            this.player1.playUpgrade(this.bonerotVenom, this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('play area');
            expect(this.mackTheKnife.upgrades).toContain(this.bonerotVenom);
            this.player1.reap(this.mackTheKnife);
            expect(this.mackTheKnife.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(2);
        });

        it('should deal 2 damage to mack the knife when he removes the stun', function () {
            this.player1.playUpgrade(this.bonerotVenom, this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('play area');
            expect(this.mackTheKnife.upgrades).toContain(this.bonerotVenom);
            this.mackTheKnife.stunned = true;
            this.player1.clickCard(this.mackTheKnife);
            this.player1.clickPrompt("Remove this creature's stun");
            expect(this.mackTheKnife.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(1);
        });

        it('should deal 2 damage to brend when he removes the stun', function () {
            this.player1.playUpgrade(this.bonerotVenom, this.brendTheFanatic);
            expect(this.brendTheFanatic.location).toBe('play area');
            expect(this.brendTheFanatic.upgrades).toContain(this.bonerotVenom);
            this.brendTheFanatic.stunned = true;
            this.player1.clickCard(this.brendTheFanatic);
            this.player1.clickPrompt("Remove this creature's stun");
            expect(this.brendTheFanatic.tokens.damage).toBe(2);
        });

        it('should deal 2 damage to mack the knife when he uses his action ability', function () {
            this.player1.playUpgrade(this.bonerotVenom, this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('play area');
            expect(this.mackTheKnife.upgrades).toContain(this.bonerotVenom);
            this.player1.clickCard(this.mackTheKnife);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Mack the Knife');
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.mackTheKnife);
            this.player1.clickCard(this.mindwarper);
            expect(this.mindwarper.tokens.damage).toBe(1);
            expect(this.mackTheKnife.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(1);
        });

        it('should deal 2 damage to mack the knife when he fights mindwarper who is elusive', function () {
            this.player1.playUpgrade(this.bonerotVenom, this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('play area');
            expect(this.mackTheKnife.upgrades).toContain(this.bonerotVenom);
            this.player1.clickCard(this.mackTheKnife);
            this.player1.clickPrompt('Fight with this creature');
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            this.player1.clickCard(this.mindwarper);
            expect(this.mackTheKnife.tokens.damage).toBe(2);
        });

        it('should deal 2 damage to mack the knife and kill him when he fights blypyp who is not elusive', function () {
            this.player1.playUpgrade(this.bonerotVenom, this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('play area');
            expect(this.mackTheKnife.upgrades).toContain(this.bonerotVenom);
            this.player1.clickCard(this.mackTheKnife);
            this.player1.clickPrompt('Fight with this creature');
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            this.player1.clickCard(this.blypyp);
            expect(this.mackTheKnife.location).toBe('discard');
        });

        it('should not trigger if exhausted by other means via the other player', function () {
            this.nm2 = this.player2.hand[0];
            this.player1.playUpgrade(this.bonerotVenom, this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('play area');
            expect(this.mackTheKnife.upgrades).toContain(this.bonerotVenom);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.nm2);
            expect(this.player2).toBeAbleToSelect(this.mackTheKnife);
            this.player2.clickCard(this.mackTheKnife);
            this.player2.clickPrompt('done');
            expect(this.mackTheKnife.tokens.damage).not.toBe(2);
        });

        it('should not trigger if exhausted by other means by its controller', function () {
            this.player1.playUpgrade(this.bonerotVenom, this.mackTheKnife);
            expect(this.mackTheKnife.location).toBe('play area');
            expect(this.mackTheKnife.upgrades).toContain(this.bonerotVenom);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.play(this.nocturnalManeuver);
            expect(this.player1).toBeAbleToSelect(this.mackTheKnife);
            this.player1.clickCard(this.mackTheKnife);
            this.player1.clickPrompt('done');
            expect(this.mackTheKnife.exhausted).toBe(true);
            expect(this.mackTheKnife.tokens.damage).not.toBe(2);
        });

        it('should destroy umbra if umbra fights due to ganger chieftain', function () {
            this.player1.play(this.umbra);
            this.player1.playUpgrade(this.bonerotVenom, this.umbra);
            expect(this.umbra.upgrades).toContain(this.bonerotVenom);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.gangerChieftain);
            expect(this.player1).toBeAbleToSelect(this.gangerChieftain);
            this.player1.clickCard(this.gangerChieftain);
            expect(this.player1).toHavePrompt('Ganger Chieftain');
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.umbra);
            let blypyp = this.player2.findCardByName('blypyp');
            expect(this.player1).toBeAbleToSelect(blypyp);
            this.player1.clickCard(blypyp);
            expect(blypyp.location).toBe('discard');
            expect(this.umbra.location).toBe('discard');
        });

        it('should destroy mack if mack fights due to ganger chieftain', function () {
            this.player1.playUpgrade(this.bonerotVenom, this.mackTheKnife);
            expect(this.mackTheKnife.upgrades).toContain(this.bonerotVenom);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.gangerChieftain);
            expect(this.player1).toBeAbleToSelect(this.gangerChieftain);
            this.player1.clickCard(this.gangerChieftain);
            expect(this.player1).toHavePrompt('Ganger Chieftain');
            expect(this.player1).toBeAbleToSelect(this.mackTheKnife);
            this.player1.clickCard(this.mackTheKnife);
            let blypyp = this.player2.findCardByName('blypyp');
            expect(this.player1).toBeAbleToSelect(blypyp);
            this.player1.clickCard(blypyp);
            expect(blypyp.location).toBe('discard');
            expect(this.mackTheKnife.location).toBe('discard');
        });
    });
});
