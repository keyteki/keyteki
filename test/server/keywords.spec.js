describe('keywords', function () {
    describe('Taunt', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['francus'],
                    hand: ['protect-the-weak']
                },
                player2: {
                    inPlay: [
                        'bulwark',
                        'ganymede-archivist',
                        'champion-anaphiel',
                        'inka-the-spider'
                    ]
                }
            });
        });

        it('should not allow attacking neighboring creatures without taunt', function () {
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.fightWith(this.francus);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.francus);
            expect(this.player1).not.toBeAbleToSelect(this.ganymedeArchivist);
            expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
        });

        it('should allow fighting a creature with taunt next to a creature with taunt', function () {
            this.player1.playUpgrade(this.protectTheWeak, this.inkaTheSpider);
            expect(this.protectTheWeak.location).toBe('play area');
            expect(this.inkaTheSpider.upgrades).toContain(this.protectTheWeak);
            expect(this.bulwark.checkRestrictions('attack')).toBe(true);
            this.player1.fightWith(this.francus);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.francus);
            expect(this.player1).not.toBeAbleToSelect(this.ganymedeArchivist);
            expect(this.player1).toBeAbleToSelect(this.inkaTheSpider);
        });
    });

    describe('Assault/Hazardous', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['mighty-tiger', 'zorg', 'combat-pheromones'],
                    hand: ['way-of-the-bear']
                },
                player2: {
                    inPlay: ['ancient-bear', 'inka-the-spider', 'briar-grubbling']
                }
            });
        });

        it('Assault should deal damage before the fight starts', function () {
            this.player1.playUpgrade(this.wayOfTheBear, this.mightyTiger);
            this.player1.fightWith(this.mightyTiger, this.inkaTheSpider);
            expect(this.inkaTheSpider.location).toBe('discard');
            expect(this.mightyTiger.location).toBe('play area');
        });

        it('Assault should stop hazardous if it resolves first', function () {
            this.player1.playUpgrade(this.wayOfTheBear, this.mightyTiger);
            expect(this.wayOfTheBear.location).toBe('play area');
            expect(this.mightyTiger.getKeywordValue('assault')).toBe(2);
            this.player1.fightWith(this.mightyTiger, this.briarGrubbling);
            expect(this.player1).toHavePrompt('Any Interrupts?');
            this.player1.clickCard(this.mightyTiger);
            expect(this.briarGrubbling.location).toBe('discard');
            expect(this.mightyTiger.location).toBe('play area');
        });

        it('Hazardous should stop Assault if it resolves first', function () {
            this.player1.playUpgrade(this.wayOfTheBear, this.mightyTiger);
            this.player1.fightWith(this.mightyTiger, this.briarGrubbling);
            expect(this.player1).toHavePrompt('Any Interrupts?');
            this.player1.clickCard(this.briarGrubbling);
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.briarGrubbling.location).toBe('play area');
        });

        it('should trigger at the same time as before fight actions', function () {
            this.player1.clickCard(this.combatPheromones);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.clickCard(this.zorg);
            this.player1.clickPrompt('Done');
            expect(this.combatPheromones.location).toBe('discard');
            this.player1.fightWith(this.zorg, this.briarGrubbling);
            expect(this.player1).toHavePrompt('Any Interrupts?');
            this.player1.clickCard(this.zorg);
            expect(this.inkaTheSpider.stunned).toBe(true);
            expect(this.briarGrubbling.location).toBe('discard');
            expect(this.zorg.location).toBe('discard');
        });
    });

    describe('Skirmish/Elusive/Poison', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['ancient-bear', 'inka-the-spider', 'snufflegator'],
                    hand: ['way-of-the-wolf']
                },
                player2: {
                    inPlay: [
                        'urchin',
                        'briar-grubbling',
                        'mighty-tiger',
                        'magda-the-rat',
                        'sinder'
                    ],
                    hand: ['flame-wreathed']
                }
            });
        });

        it('Skirmish should deal damage without taking any', function () {
            this.player1.fightWith(this.snufflegator, this.mightyTiger);
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.snufflegator.hasToken('damage')).toBe(false);
        });

        it("Skirmish shouldn't stop Hazardous", function () {
            this.player1.fightWith(this.snufflegator, this.briarGrubbling);
            expect(this.briarGrubbling.location).toBe('play area');
            expect(this.snufflegator.location).toBe('discard');
            expect(this.briarGrubbling.hasToken('damage')).toBe(false);
        });

        it('Skirmish should work with poison', function () {
            this.player1.playUpgrade(this.wayOfTheWolf, this.inkaTheSpider);
            this.player1.fightWith(this.inkaTheSpider, this.mightyTiger);
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.inkaTheSpider.location).toBe('play area');
            expect(this.inkaTheSpider.hasToken('damage')).toBe(false);
        });

        it('Elusive should result in both creatures taking no damage', function () {
            this.player1.fightWith(this.inkaTheSpider, this.urchin);
            expect(this.urchin.location).toBe('play area');
            expect(this.inkaTheSpider.location).toBe('play area');
            expect(this.urchin.hasToken('damage')).toBe(false);
            expect(this.inkaTheSpider.hasToken('damage')).toBe(false);
        });

        it("Elusive shouldn't stop damage on the second attack", function () {
            this.player1.fightWith(this.inkaTheSpider, this.urchin);
            this.player1.fightWith(this.snufflegator, this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.snufflegator.hasToken('damage')).toBe(false);
        });

        it("Elusive shouldn't stop Assault", function () {
            this.player1.fightWith(this.ancientBear, this.urchin);
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.urchin.location).toBe('discard');
            expect(this.ancientBear.location).toBe('play area');
            expect(this.ancientBear.hasToken('damage')).toBe(false);
        });

        it('Elusive should work with Hazardous', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.playUpgrade(this.flameWreathed, this.urchin);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.inkaTheSpider, this.urchin);
            expect(this.inkaTheSpider.location).toBe('discard');
        });

        it('Poison should destroy the creature', function () {
            this.player1.fightWith(this.inkaTheSpider, this.mightyTiger);
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.inkaTheSpider.location).toBe('discard');
        });

        it('Poison should not destroy the creature if damage is prevented by armor', function () {
            this.player1.fightWith(this.inkaTheSpider, this.sinder);
            expect(this.sinder.location).toBe('play area');
            expect(this.inkaTheSpider.location).toBe('discard');
        });
    });
});
