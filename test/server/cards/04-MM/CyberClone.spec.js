describe('Cyber-Clone', function () {
    describe("Cyber-Clone's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['cyber-clone', 'mimic-gel']
                },
                player2: {
                    hand: ['flame-wreathed', 'shoulder-armor'],
                    amber: 2
                }
            });
        });

        it('should enter as a 1-power, no keyword, single trait, no armor creature, if no other creature is in play', function () {
            this.player1.play(this.cyberClone);
            expect(this.cyberClone.location).toBe('play area');
            expect(this.cyberClone.power).toBe(1);
            expect(this.cyberClone.armor).toBe(0);
            expect(this.cyberClone.getTraits().length).toBe(1);
            expect(this.cyberClone.getTraits()).toContain('mutant');
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(0);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Cyber-Clone's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: [
                        'mother',
                        'batdrone',
                        'prescriptive-grammarbot',
                        'groupthink-tank',
                        'reckless-rizzo'
                    ],
                    hand: ['cyber-clone', 'mimic-gel', 'academy-training']
                },
                player2: {
                    inPlay: [
                        'bulwark',
                        'xenos-bloodshadow',
                        'lion-bautrem',
                        'abond-the-armorsmith'
                    ],
                    hand: ['flame-wreathed', 'shoulder-armor'],
                    amber: 2
                }
            });
        });

        it('should purge a creature in play and gain its power and armor', function () {
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.groupthinkTank);
            expect(this.groupthinkTank.location).toBe('purged');
            expect(this.cyberClone.power).toBe(4);
            expect(this.cyberClone.armor).toBe(3);
            expect(this.cyberClone.getTraits().length).toBe(3);
            expect(this.cyberClone.getTraits()).toContain('mutant');
            expect(this.cyberClone.getTraits()).toContain('robot');
            expect(this.cyberClone.getTraits()).toContain('experiment');
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(0);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prevent purge with ward, but still gain its power and armor', function () {
            this.groupthinkTank.tokens.ward = 1;
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.groupthinkTank);
            expect(this.groupthinkTank.location).toBe('play area');
            expect(this.groupthinkTank.tokens.ward).toBeUndefined();
            expect(this.cyberClone.power).toBe(4);
            expect(this.cyberClone.armor).toBe(3);
            expect(this.cyberClone.getTraits().length).toBe(3);
            expect(this.cyberClone.getTraits()).toContain('mutant');
            expect(this.cyberClone.getTraits()).toContain('robot');
            expect(this.cyberClone.getTraits()).toContain('experiment');
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(0);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should purge and clone Mimic Gel', function () {
            this.player1.play(this.mimicGel);
            this.player1.clickCard(this.groupthinkTank);
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.mimicGel);
            expect(this.mimicGel.location).toBe('purged');
            expect(this.cyberClone.power).toBe(4);
            expect(this.cyberClone.armor).toBe(3);
            expect(this.cyberClone.getTraits().length).toBe(3);
            expect(this.cyberClone.getTraits()).toContain('mutant');
            expect(this.cyberClone.getTraits()).toContain('robot');
            expect(this.cyberClone.getTraits()).toContain('experiment');
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(0);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should clone modified power, armor and keywords', function () {
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.xenosBloodshadow);
            expect(this.xenosBloodshadow.location).toBe('purged');
            expect(this.cyberClone.power).toBe(6);
            expect(this.cyberClone.armor).toBe(3);
            expect(this.cyberClone.getTraits().length).toBe(3);
            expect(this.cyberClone.getTraits()).toContain('mutant');
            expect(this.cyberClone.getTraits()).toContain('human');
            expect(this.cyberClone.getTraits()).toContain('witch');
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(4);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should clone removed keywords', function () {
            this.player1.playUpgrade(this.academyTraining, this.recklessRizzo);
            this.player1.useAction(this.recklessRizzo);
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.recklessRizzo);
            expect(this.recklessRizzo.location).toBe('purged');
            expect(this.cyberClone.power).toBe(1);
            expect(this.cyberClone.armor).toBe(0);
            expect(this.cyberClone.getTraits().length).toBe(3);
            expect(this.cyberClone.getTraits()).toContain('mutant');
            expect(this.cyberClone.getTraits()).toContain('elf');
            expect(this.cyberClone.getTraits()).toContain('thief');
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(1);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
