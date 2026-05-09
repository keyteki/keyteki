describe('Harmonic Pack', function () {
    describe("Harmonic Pack's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['cpo-zytar'],
                    hand: ['harmonic-pack']
                },
                player2: {
                    inPlay: ['crim-torchtooth', 'ganger-chieftain'],
                    archives: ['brikk-nastee']
                }
            });
        });

        it('should deal 2 damage, discard from enemy archives, and do 3 more damage', function () {
            this.player1.play(this.harmonicPack);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.crimTorchtooth);
            expect(this.player1).toBeAbleToSelect(this.gangerChieftain);
            this.player1.clickCard(this.crimTorchtooth);
            expect(this.player1).toHavePrompt("Which player's archives");
            this.player1.clickPrompt("Opponent's");
            expect(this.brikkNastee.location).toBe('discard');
            expect(this.crimTorchtooth.damage).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should only do 2 damage if no card was discarded from archives (also it should let you choose an archive which has no cards in it)', function () {
            this.player1.play(this.harmonicPack);
            this.player1.clickCard(this.crimTorchtooth);
            this.player1.clickPrompt('Mine');
            expect(this.brikkNastee.location).toBe('archives');
            expect(this.crimTorchtooth.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard from archives even if there was no creature to damage', function () {
            this.player2.moveCard(this.gangerChieftain, 'discard');
            this.player2.moveCard(this.crimTorchtooth, 'discard');
            this.player1.moveCard(this.cpoZytar, 'discard');
            expect(this.player1).isReadyToTakeAction();
            this.player1.play(this.harmonicPack);
            this.player1.clickPrompt("Opponent's");
            expect(this.brikkNastee.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should leave discarded card on top of a destroyed creature', function () {
            this.player1.play(this.harmonicPack);
            this.player1.clickCard(this.gangerChieftain);
            expect(this.player1).toHavePrompt("Which player's archives");
            this.player1.clickPrompt("Opponent's");
            expect(this.brikkNastee.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('discard');
            expect(this.player2.player.discard[0]).toBe(this.brikkNastee);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Harmonic Pack against a target with 1 armor', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['harmonic-pack']
                },
                player2: {
                    inPlay: ['grabber-jammer'],
                    archives: ['brikk-nastee']
                }
            });
        });

        it('discards from archives but does not deal the additional 3 damage', function () {
            this.player1.play(this.harmonicPack);
            this.player1.clickCard(this.grabberJammer);
            this.player1.clickPrompt("Opponent's");
            expect(this.brikkNastee.location).toBe('discard');
            expect(this.grabberJammer.tokens.damage).toBe(1);
            expect(this.grabberJammer.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Harmonic Pack against a target with 2 armor', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['harmonic-pack']
                },
                player2: {
                    inPlay: ['bulwark'],
                    archives: ['brikk-nastee']
                }
            });
        });

        it('discards from archives but does not deal the additional 3 damage', function () {
            this.player1.play(this.harmonicPack);
            this.player1.clickCard(this.bulwark);
            this.player1.clickPrompt("Opponent's");
            expect(this.brikkNastee.location).toBe('discard');
            expect(this.bulwark.tokens.damage).toBeUndefined();
            expect(this.bulwark.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Harmonic Pack against a warded target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['harmonic-pack']
                },
                player2: {
                    inPlay: ['crim-torchtooth'],
                    archives: ['brikk-nastee']
                }
            });
        });

        it('discards from archives but does not deal the additional 3 damage', function () {
            this.crimTorchtooth.ward();
            this.player1.play(this.harmonicPack);
            this.player1.clickCard(this.crimTorchtooth);
            this.player1.clickPrompt("Opponent's");
            expect(this.brikkNastee.location).toBe('discard');
            expect(this.crimTorchtooth.warded).toBe(false);
            expect(this.crimTorchtooth.tokens.damage).toBeUndefined();
            expect(this.crimTorchtooth.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Harmonic Pack against an invulnerable target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['harmonic-pack']
                },
                player2: {
                    inPlay: ['emperor-memrox'],
                    archives: ['brikk-nastee']
                }
            });
        });

        it('discards from archives but does not deal damage to the invulnerable creature', function () {
            expect(this.emperorMemrox.hasKeyword('invulnerable')).toBe(true);
            this.player1.play(this.harmonicPack);
            this.player1.clickCard(this.emperorMemrox);
            this.player1.clickPrompt("Opponent's");
            expect(this.brikkNastee.location).toBe('discard');
            expect(this.emperorMemrox.tokens.damage).toBeUndefined();
            expect(this.emperorMemrox.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Harmonic Pack when revealed card cannot be discarded', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['memrox-the-red'],
                    hand: ['harmonic-pack']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('still deals 3 more damage even though the revealed card cannot be discarded', function () {
            this.player1.moveCard(this.troll, 'archives');
            expect(this.player1.archives).toContain(this.troll);
            this.player1.play(this.harmonicPack);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Mine');
            expect(this.player1.archives).toContain(this.troll);
            expect(this.krump.location).toBe('play area');
            expect(this.krump.damage).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('still deals 3 more damage and discards card if Memrox the Red is destroyed', function () {
            this.player1.moveCard(this.troll, 'archives');
            expect(this.player1.archives).toContain(this.troll);
            this.player1.play(this.harmonicPack);
            this.player1.clickCard(this.memroxTheRed);
            this.player1.clickPrompt('Mine');
            expect(this.memroxTheRed.location).toBe('discard');
            expect(this.troll.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with abducted cards', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['uxlyx-the-zookeeper', 'cpo-zytar'],
                    hand: ['harmonic-pack']
                },
                player2: {
                    inPlay: ['batdrone', 'krump']
                }
            });
        });

        it('should reveal abducted card before returning it to owner hand', function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('archives');
            expect(this.player1.archives).toContain(this.batdrone);
            this.player1.play(this.harmonicPack);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Mine');
            expect(this.krump.damage).toBe(5);
            expect(this.batdrone.location).toBe('hand');
            expect(this.player2.hand).toContain(this.batdrone);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
