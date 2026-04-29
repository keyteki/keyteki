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
            expect(this.player1).isReadyToTakeAction();
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
                        'duskwitch',
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
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not consider omega effect of cloned card', function () {
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.duskwitch);
            expect(this.duskwitch.location).toBe('purged');
            expect(this.cyberClone.power).toBe(1);
            expect(this.cyberClone.armor).toBe(0);
            expect(this.cyberClone.getTraits().length).toBe(3);
            expect(this.cyberClone.getTraits()).toContain('mutant');
            expect(this.cyberClone.getTraits()).toContain('human');
            expect(this.cyberClone.getTraits()).toContain('witch');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should prevent purge with ward, but still gain its power and armor', function () {
            this.groupthinkTank.ward();
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.groupthinkTank);
            expect(this.groupthinkTank.location).toBe('play area');
            expect(this.groupthinkTank.warded).toBe(false);
            expect(this.cyberClone.power).toBe(4);
            expect(this.cyberClone.armor).toBe(3);
            expect(this.cyberClone.getTraits().length).toBe(3);
            expect(this.cyberClone.getTraits()).toContain('mutant');
            expect(this.cyberClone.getTraits()).toContain('robot');
            expect(this.cyberClone.getTraits()).toContain('experiment');
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(0);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should purge and clone Mimic Gel, but destroy itself right after due to power 0', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.groupthinkTank);
            this.player1.clickPrompt('Left');
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.mimicGel);
            expect(this.mimicGel.location).toBe('purged');
            expect(this.cyberClone.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should clone printed power, armor and keywords', function () {
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.xenosBloodshadow);
            expect(this.xenosBloodshadow.location).toBe('purged');
            expect(this.cyberClone.power).toBe(4);
            expect(this.cyberClone.armor).toBe(0);
            expect(this.cyberClone.getTraits().length).toBe(3);
            expect(this.cyberClone.getTraits()).toContain('mutant');
            expect(this.cyberClone.getTraits()).toContain('human');
            expect(this.cyberClone.getTraits()).toContain('witch');
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(4);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not clone removed keywords', function () {
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
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Cyber Clone and Gigantic's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['niffle-kong', 'niffle-kong2']
                },
                player2: {
                    inPlay: ['dust-pixie'],
                    hand: ['cyber-clone', 'helper-bot', 'imp-losion']
                }
            });
        });

        it('should allow purging gigantic if played bottom part', function () {
            this.player1.play(this.niffleKong);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.cyberClone);
            this.player2.clickCard(this.niffleKong);
            expect(this.cyberClone.location).toBe('play area');
            expect(this.cyberClone.power).toBe(12);
            expect(this.cyberClone.armor).toBe(2);
            expect(this.cyberClone.hasTrait('mutant')).toBe(true);
            expect(this.cyberClone.hasTrait('niffle')).toBe(true);
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(0);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.niffleKong.location).toBe('purged');
            expect(this.niffleKong2.location).toBe('purged');
        });

        it('should allow purging gigantic if played top part', function () {
            this.player1.play(this.niffleKong2);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.cyberClone);
            this.player2.clickCard(this.niffleKong2);
            expect(this.cyberClone.location).toBe('play area');
            expect(this.cyberClone.power).toBe(12);
            expect(this.cyberClone.armor).toBe(2);
            expect(this.cyberClone.hasTrait('mutant')).toBe(true);
            expect(this.cyberClone.hasTrait('niffle')).toBe(true);
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(0);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.niffleKong.location).toBe('purged');
            expect(this.niffleKong2.location).toBe('purged');
        });
    });

    describe("Cyber Clone and Gigantic's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    token: 'defender',
                    inPlay: ['defender:foggify'],
                    hand: ['cyber-clone', 'badgemagus']
                },
                player2: {
                    token: 'grunt',
                    inPlay: ['grunt:collector-worm'],
                    hand: ['ether-spider']
                }
            });
        });

        it('should allow purging own token creature', function () {
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.defender);
            expect(this.cyberClone.location).toBe('play area');
            expect(this.cyberClone.power).toBe(2);
            expect(this.cyberClone.armor).toBe(1);
            expect(this.cyberClone.hasTrait('human')).toBe(true);
            expect(this.cyberClone.hasTrait('knight')).toBe(true);
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(0);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.defender.location).toBe('purged');
        });

        it("should allow purging opponent's token creature", function () {
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.grunt);
            expect(this.cyberClone.location).toBe('play area');
            expect(this.cyberClone.power).toBe(3);
            expect(this.cyberClone.armor).toBe(0);
            expect(this.cyberClone.hasTrait('martian')).toBe(true);
            expect(this.cyberClone.hasTrait('soldier')).toBe(true);
            expect(this.cyberClone.getEffects('addKeyword').length).toBe(0);
            expect(this.cyberClone.getEffects('removeKeyword').length).toBe(0);
            expect(this.grunt.location).toBe('purged');
        });
    });
});
