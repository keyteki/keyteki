describe('One Stood Against Many', function () {
    describe('when no creature is in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['one-stood-against-many']
                },
                player2: {}
            });
        });

        it('should not prompt to choose a creature', function () {
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("when no player's creatures are in play", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['one-stood-against-many']
                },
                player2: {
                    inPlay: ['hunting-witch']
                }
            });
        });

        it('should not prompt to choose a creature', function () {
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("when no opponent's creatures are in play", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark'],
                    hand: ['one-stood-against-many']
                },
                player2: {}
            });
        });

        it('should prompt to choose a creature', function () {
            this.player1.reap(this.bulwark);
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            this.player1.clickCard(this.bulwark);
            expect(this.bulwark.exhausted).toBe(false);
            this.player1.reap(this.bulwark);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when one enemy creature is in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark'],
                    hand: ['one-stood-against-many']
                },
                player2: {
                    inPlay: ['hunting-witch']
                }
            });
        });

        it('should prompt once', function () {
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.huntingWitch);
            expect(this.bulwark.exhausted).toBe(false);
            expect(this.bulwark.tokens.damage).toBeUndefined();
            expect(this.bulwark.tokens.armor).toBeUndefined();
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when two enemy creatures are in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark', 'troll'],
                    hand: ['one-stood-against-many']
                },
                player2: {
                    inPlay: ['hunting-witch', 'niffle-ape']
                }
            });
        });

        it('should prompt twice once', function () {
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            this.player1.clickCard(this.bulwark);

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            this.player1.clickCard(this.huntingWitch);

            expect(this.bulwark.tokens.armor).toBeUndefined();
            expect(this.bulwark.tokens.damage).toBeUndefined();
            expect(this.huntingWitch.location).toBe('discard');

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            this.player1.clickCard(this.niffleApe);

            expect(this.bulwark.exhausted).toBe(false);
            expect(this.bulwark.tokens.damage).toBe(3);
            expect(this.niffleApe.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when three enemy creatures are in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark', 'troll'],
                    hand: ['one-stood-against-many']
                },
                player2: {
                    inPlay: ['hunting-witch', 'niffle-ape', 'bumblebird', 'glimmer']
                }
            });
        });

        it('should prompt three times', function () {
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            expect(this.player1).not.toBeAbleToSelect(this.glimmer);
            expect(this.player1).not.toBeAbleToSelect(this.bumblebird);
            this.player1.clickCard(this.troll);

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.huntingWitch);

            expect(this.troll.tokens.armor).toBeUndefined();
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.huntingWitch.location).toBe('discard');

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.niffleApe);

            expect(this.troll.tokens.damage).toBe(3);
            expect(this.niffleApe.location).toBe('discard');

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.bumblebird);

            expect(this.troll.exhausted).toBe(true);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.bumblebird.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should unstun and prompt twice if creature is stunned', function () {
            this.troll.stun();
            expect(this.troll.stunned).toBe(true);
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            expect(this.player1).not.toBeAbleToSelect(this.glimmer);
            expect(this.player1).not.toBeAbleToSelect(this.bumblebird);
            this.player1.clickCard(this.troll);
            expect(this.troll.stunned).toBe(false);

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.niffleApe);

            expect(this.troll.tokens.damage).toBe(1);
            expect(this.niffleApe.location).toBe('discard');

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.bumblebird);

            expect(this.troll.exhausted).toBe(true);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.bumblebird.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when three enemy creatures are in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark', 'troll'],
                    hand: ['one-stood-against-many']
                },
                player2: {
                    inPlay: ['hunting-witch', 'niffle-ape', 'bumblebird', 'glimmer']
                }
            });
        });

        it('should prompt three times', function () {
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            expect(this.player1).not.toBeAbleToSelect(this.glimmer);
            expect(this.player1).not.toBeAbleToSelect(this.bumblebird);
            this.player1.clickCard(this.troll);

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.huntingWitch);

            expect(this.troll.tokens.armor).toBeUndefined();
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.huntingWitch.location).toBe('discard');

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.niffleApe);

            expect(this.troll.tokens.damage).toBe(3);
            expect(this.niffleApe.location).toBe('discard');

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.bumblebird);

            expect(this.troll.exhausted).toBe(true);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.bumblebird.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should unstun and prompt twice if creature is stunned', function () {
            this.troll.stun();
            expect(this.troll.stunned).toBe(true);
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            expect(this.player1).not.toBeAbleToSelect(this.glimmer);
            expect(this.player1).not.toBeAbleToSelect(this.bumblebird);
            this.player1.clickCard(this.troll);
            expect(this.troll.stunned).toBe(false);

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.niffleApe);

            expect(this.troll.tokens.damage).toBe(1);
            expect(this.niffleApe.location).toBe('discard');

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.bumblebird);

            expect(this.troll.exhausted).toBe(true);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.bumblebird.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when creatures are elusive', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark', 'troll'],
                    hand: ['one-stood-against-many']
                },
                player2: {
                    inPlay: ['hunting-witch', 'lamindra', 'glimmer']
                }
            });
        });

        it('should not allow selecting the same creature twice', function () {
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.troll);

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.huntingWitch);

            expect(this.troll.tokens.armor).toBe(2);
            expect(this.huntingWitch.location).toBe('play area');

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.glimmer);

            expect(this.troll.tokens.armor).toBe(2);
            expect(this.glimmer.location).toBe('play area');

            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.lamindra);

            expect(this.troll.tokens.armor).toBe(2);
            expect(this.troll.exhausted).toBe(true);
            expect(this.glimmer.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when groggins is limited by taunt', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark', 'groggins'],
                    hand: ['one-stood-against-many']
                },
                player2: {
                    inPlay: ['hunting-witch', 'gub', 'glimmer']
                }
            });
        });

        it('should not fight any creature', function () {
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.groggins);

            expect(this.groggins.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when evasion sigil triggers, should be exhausted and not fight', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark', 'troll', 'francus', 'gatekeeper', 'grey-monk'],
                    hand: ['one-stood-against-many']
                },
                player2: {
                    inPlay: ['hunting-witch', 'shooler', 'glimmer', 'evasion-sigil']
                }
            });
        });

        it('should not fight when Evasion Sigil is triggered', function () {
            this.player1.moveCard(this.francus, 'deck');
            this.player1.moveCard(this.gatekeeper, 'deck');
            this.player1.moveCard(this.greyMonk, 'deck');
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.shooler);
            expect(this.greyMonk.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.huntingWitch);
            expect(this.gatekeeper.location).toBe('discard');
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.glimmer);
            this.player1.clickCard(this.glimmer);
            expect(this.francus.location).toBe('discard');

            expect(this.bulwark.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.shooler.location).toBe('play area');
            expect(this.glimmer.location).toBe('play area');
            expect(this.bulwark.tokens.damage).toBeUndefined();
            expect(this.huntingWitch.tokens.damage).toBeUndefined();
            expect(this.shooler.tokens.damage).toBeUndefined();
            expect(this.glimmer.tokens.damage).toBeUndefined();
            expect(this.bulwark.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when played against creatures with fight effects', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark', 'troll'],
                    hand: ['one-stood-against-many']
                },
                player2: {
                    inPlay: ['gub', 'shadow-self', 'ember-imp', 'ardent-hero']
                }
            });
        });

        it('should obey fight effects', function () {
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.shadowSelf);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.ardentHero);
            this.player1.clickCard(this.troll);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.shadowSelf);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.ardentHero);
            this.player1.clickCard(this.gub);

            expect(this.troll.tokens.armor).toBe(1);
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.gub.tokens.damage).toBeUndefined();
            expect(this.shadowSelf.tokens.damage).toBe(8);

            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.shadowSelf);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.ardentHero);
            this.player1.clickCard(this.shadowSelf);

            expect(this.troll.tokens.armor).toBe(1);
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.shadowSelf.location).toBe('discard');

            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.shadowSelf);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.ardentHero);
            this.player1.clickCard(this.ardentHero);

            expect(this.troll.tokens.armor).toBeUndefined();
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.ardentHero.tokens.damage).toBeUndefined();

            expect(this.troll.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
