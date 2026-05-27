describe('Badgemagus', function () {
    describe("Badgemagus's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 1,
                    inPlay: ['niffle-ape', 'badgemagus', 'champion-anaphiel', 'ardent-hero']
                },
                player2: {
                    amber: 4,
                    inPlay: ['toad', 'gub', 'murkens', 'lamindra']
                }
            });

            this.gub.damage = 3;
            this.player1.reap(this.championAnaphiel);
        });

        it('should not prompt if no neighbors', function () {
            this.player1.moveCard(this.championAnaphiel, 'discard');
            this.player1.moveCard(this.niffleApe, 'discard');
            this.player1.moveCard(this.ardentHero, 'discard');
            this.player1.fightWith(this.badgemagus, this.lamindra);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should prompt for target if it only has left neighbor', function () {
            this.player1.moveCard(this.championAnaphiel, 'discard');
            this.player1.moveCard(this.ardentHero, 'discard');
            this.player1.fightWith(this.badgemagus, this.lamindra);
            this.player1.clickCard(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.toad);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.toad);
            expect(this.toad.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.murkens.location).toBe('play area');
            expect(this.niffleApe.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should prompt for target if it only has right neighbor', function () {
            this.player1.moveCard(this.niffleApe, 'discard');
            this.player1.moveCard(this.ardentHero, 'discard');
            this.player1.fightWith(this.badgemagus, this.lamindra);
            this.player1.clickCard(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.toad);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.gub);
            expect(this.toad.location).toBe('play area');
            expect(this.gub.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.murkens.location).toBe('play area');
            expect(this.championAnaphiel.damage).toBe(5);
            // Second use comes from the opposite side (left), if available.
            // this.player1.clickCard(this.lamindra);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should ready and fight with each neighbor one at a time, starting from left', function () {
            this.player1.fightWith(this.badgemagus, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.ardentHero);
            this.player1.clickCard(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.toad);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.toad);
            expect(this.toad.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.murkens.location).toBe('play area');
            expect(this.niffleApe.damage).toBe(1);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.niffleApe.damage).toBe(1);
            expect(this.championAnaphiel.armorUsed).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should ready and fight with each neighbor one at a time, starting from right', function () {
            this.player1.fightWith(this.badgemagus, this.lamindra);
            this.player1.clickCard(this.badgemagus);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.ardentHero);
            this.player1.clickCard(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.toad);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.gub);
            expect(this.toad.location).toBe('play area');
            expect(this.gub.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.murkens.location).toBe('play area');
            expect(this.championAnaphiel.damage).toBe(5);
            expect(this.player1).toBeAbleToSelect(this.toad);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);
            expect(this.niffleApe.damage).toBe(1);
            expect(this.championAnaphiel.damage).toBe(5);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Badgemagus with changing battleline', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['badgemagus'],
                    hand: ['sanctum-guardian', 'grey-augur', 'lightbearer-kelvin']
                },
                player2: {
                    inPlay: ['urchin', 'carlo-phantom', 'troll']
                }
            });
        });

        it('should not get a second use when the first-side neighbor dies and opposite side is empty', function () {
            this.player1.playCreature(this.sanctumGuardian, true);
            this.player1.playCreature(this.greyAugur, true);
            this.player1.fightWith(this.badgemagus, this.urchin);
            this.player1.clickCard(this.badgemagus);
            this.player1.clickCard(this.sanctumGuardian);
            this.player1.clickCard(this.troll);
            expect(this.sanctumGuardian.location).toBe('discard');

            expect(this.player1).isReadyToTakeAction();
        });

        it('should dynamically use Sanctum Guardian again after it swaps from left to right', function () {
            this.player1.playCreature(this.sanctumGuardian, true);

            // Fight Badgemagus
            this.player1.fightWith(this.badgemagus, this.carloPhantom);

            // Fight Sanctum Guardian left
            this.player1.clickCard(this.badgemagus);
            this.player1.clickCard(this.sanctumGuardian);
            this.player1.clickCard(this.urchin);

            // Swap Badgemagus and Sanctum Guardian
            this.player1.clickCard(this.badgemagus);
            expect(this.player1.player.creaturesInPlay).toEqual([
                this.badgemagus,
                this.sanctumGuardian
            ]);

            // Fight Sanctum Guardian right
            this.player1.clickCard(this.urchin);

            // Swap Badgemagus and Sanctum Guardian back
            this.player1.clickCard(this.badgemagus);
            expect(this.player1.player.creaturesInPlay).toEqual([
                this.sanctumGuardian,
                this.badgemagus
            ]);

            expect(this.urchin.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should dynamically select neighbors', function () {
            this.player1.playCreature(this.sanctumGuardian, true);
            this.player1.playCreature(this.greyAugur, false);

            // Fight Badgemagus
            expect(this.player1.amber).toBe(0);
            this.player1.fightWith(this.badgemagus, this.carloPhantom);

            // Grey Augur Badgemagus
            this.player1.clickPrompt(this.greyAugur.name);
            expect(this.player1.amber).toBe(1);

            // Fight Sanctum Guardian left
            this.player1.clickCard(this.badgemagus);
            this.player1.clickCard(this.sanctumGuardian);
            this.player1.clickCard(this.urchin);

            // Swap Badgemagus and Sanctum Guardian
            this.player1.clickCard(this.badgemagus);
            expect(this.player1.player.creaturesInPlay).toEqual([
                this.badgemagus,
                this.sanctumGuardian,
                this.greyAugur
            ]);

            // Grey Augur interrupts and autoresolves for Sanctum Guardian left fight
            expect(this.player1.amber).toBe(2);

            // Fight Sanctum Guardian right
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');

            // Choose Grey Augur Sanctum Guardian right fight
            this.player1.clickPrompt(this.greyAugur.name);
            expect(this.player1.amber).toBe(3);

            // Swap Badgemagus and Sanctum Guardian back
            this.player1.clickCard(this.badgemagus);

            // Grey Augur grants Badgemagus another gain amber after fight which autoresolves
            expect.soft(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should dynamically select neighbors', function () {
            this.player1.playCreature(this.sanctumGuardian, true);
            this.player1.playCreature(this.greyAugur, false);

            // Fight Badgemagus
            expect(this.player1.amber).toBe(0);
            this.player1.fightWith(this.badgemagus, this.carloPhantom);

            // Grey Augur Badgemagus
            this.player1.clickPrompt(this.greyAugur.name);
            expect(this.player1.amber).toBe(1);

            // Fight Sanctum Guardian left
            this.player1.clickCard(this.badgemagus);
            this.player1.clickCard(this.sanctumGuardian);
            this.player1.clickCard(this.urchin);

            // Swap Badgemagus and Sanctum Guardian
            this.player1.clickCard(this.badgemagus);
            expect(this.player1.player.creaturesInPlay).toEqual([
                this.badgemagus,
                this.sanctumGuardian,
                this.greyAugur
            ]);

            // Grey Augur interrupts and autoresolves for Sanctum Guardian left fight
            expect(this.player1.amber).toBe(2);

            // Fight Sanctum Guardian right
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');

            // Swap Badgemagus and Sanctum Guardian back
            this.player1.clickPrompt(this.sanctumGuardian.name);
            this.player1.clickCard(this.badgemagus);

            // Grey Augur grants Badgemagus another gain amber after fight which autoresolves
            expect.soft(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should dynamically select neighbors', function () {
            this.player1.deck = [];
            this.player1.moveCard(this.greyAugur, 'deck');
            this.player1.playCreature(this.lightbearerKelvin, true);

            // Fight Badgemagus
            this.player1.fightWith(this.badgemagus, this.carloPhantom);

            // Fight Lightbearer Kelvin
            this.player1.clickCard(this.badgemagus);
            this.player1.clickCard(this.lightbearerKelvin);
            this.player1.clickCard(this.urchin);

            // Play Grey Augur
            this.player1.clickPrompt('My Deck');
            this.player1.clickPrompt('Right');

            // Fight Grey Augur
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');

            // Badgemagus Grey Augur
            expect.soft(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Badgemagus with changing battleline', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['han-peregrine', 'badgemagus', 'the-terror', 'gub'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['urchin', 'umbra']
                }
            });
            this.player1.makeMaverick(this.soulkeeper, 'sanctum');
        });

        it('should still fight with the other neighbor if Badgemagus dies during the first neighbor fight', function () {
            this.player1.playUpgrade(this.soulkeeper, this.urchin);
            this.badgemagus.powerCounters = 3;

            // Badgemagus fights
            this.player1.fightWith(this.badgemagus, this.urchin);

            // Han Peregrine fights
            this.player1.clickCard(this.hanPeregrine);
            this.player1.clickCard(this.urchin);

            // Soulkeeper kills Badgemagus
            this.player1.clickCard(this.badgemagus);
            expect(this.badgemagus.location).toBe('discard');

            // Han Peregrine exalts
            this.player1.clickCard(this.hanPeregrine);
            this.player1.clickCard(this.hanPeregrine);
            expect(this.hanPeregrine.amber).toBe(1);
            this.player1.clickCard(this.theTerror);
            this.player1.clickPrompt('Right');

            // The Terror has moved but still fights
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.umbra);
            this.theTerror.exhausted = true;
            this.theTerror.damage = 2;
            this.gub.exhausted = false;
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
