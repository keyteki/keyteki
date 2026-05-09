describe('Infighting', function () {
    describe("Infighting's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: [
                        'infighting',
                        'the-common-cold',
                        'gateway-to-dis',
                        'dust-pixie',
                        'dharna'
                    ],
                    inPlay: ['nexus', 'urchin']
                },
                player2: {
                    inPlay: ['mother', 'zorg', 'batdrone']
                }
            });
        });

        it('should cause each creature to deal their power in damage to the creature on its right', function () {
            this.player1.play(this.infighting);
            // should be dead since it takes damage from nexus
            expect(this.urchin.location).toBe('discard');

            // should be un harmed since was on urchin's left
            expect(this.nexus.location).toBe('play area');
            expect(this.nexus.damage).toBe(0);

            // should be dead because batrone is on zorg's right
            expect(this.batdrone.location).toBe('discard');

            // should take 5 damage from mother, because zorg is on mother's right
            expect(this.zorg.location).toBe('play area');
            expect(this.zorg.damage).toBe(5);

            // should be alive, with no damage
            expect(this.mother.damage).toBe(0);
            expect(this.mother.location).toBe('play area');
        });

        it('should not harm a creature which is alone', function () {
            this.player1.play(this.theCommonCold);
            this.player1.clickPrompt('No');
            expect(this.urchin.location).toBe('discard');
            expect(this.nexus.damage).toBe(1);

            this.player1.play(this.infighting);
            expect(this.nexus.location).toBe('play area');
            expect(this.nexus.damage).toBe(1);
        });

        it('it should do nothing if there are no creatures in play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.play(this.gatewayToDis);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.play(this.infighting);
        });

        it('it should work even when there are only creatures on one side', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.play(this.gatewayToDis);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player1.play(this.dustPixie);
            this.player1.play(this.dharna);
            this.player1.play(this.infighting);

            expect(this.dharna.damage).toBe(1);
        });
    });

    describe('Infighting and Shoulder Id', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['infighting'],
                    inPlay: ['lamindra', 'shoulder-id', 'urchin']
                },
                player2: {
                    amber: 5,
                    inPlay: ['mother', 'zorg', 'batdrone']
                }
            });
        });

        it('should steal when shoulder id would deal damage to Urchin', function () {
            this.player1.play(this.infighting);
            expect(this.lamindra.damage).toBe(0);
            expect(this.shoulderId.damage).toBe(1);
            expect(this.urchin.damage).toBe(0);
            expect(this.urchin.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
    });

    describe('Infighting and Ardent Hero', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['gub', 'niffle-ape'],
                    hand: ['infighting']
                },
                player2: {
                    amber: 4,
                    inPlay: ['the-grey-rider', 'adaptoid', 'ardent-hero', 'champion-anaphiel']
                }
            });
        });

        it('should not take damage if neighbor is mutant', function () {
            this.player1.play(this.infighting);
            expect(this.gub.damage).toBe(0);
            expect(this.gub.location).toBe('play area');
            expect(this.niffleApe.damage).toBe(1);

            expect(this.theGreyRider.damage).toBe(0);
            expect(this.theGreyRider.location).toBe('play area');
            expect(this.adaptoid.damage).toBe(2);
            expect(this.ardentHero.damage).toBe(0);
            expect(this.ardentHero.location).toBe('play area');
            expect(this.championAnaphiel.damage).toBe(3);
        });

        it('should take damage if neighbor is not-mutant', function () {
            this.player2.moveCard(this.adaptoid, 'discard');
            this.player1.play(this.infighting);
            expect(this.gub.damage).toBe(0);
            expect(this.gub.location).toBe('play area');
            expect(this.niffleApe.damage).toBe(1);

            expect(this.theGreyRider.damage).toBe(0);
            expect(this.theGreyRider.location).toBe('play area');
            expect(this.ardentHero.damage).toBe(2);
            expect(this.ardentHero.location).toBe('play area');
            expect(this.championAnaphiel.damage).toBe(3);
        });
    });

    describe('Infighting, Ardent Hero and Shoulder Id', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['infighting'],
                    inPlay: ['lamindra', 'shoulder-id', 'ardent-hero']
                },
                player2: {
                    amber: 5,
                    inPlay: ['mother', 'zorg', 'batdrone']
                }
            });
        });

        it('should steal when shoulder id would deal damage to Ardent Hero', function () {
            this.player1.play(this.infighting);
            expect(this.lamindra.damage).toBe(0);
            expect(this.shoulderId.damage).toBe(1);
            expect(this.ardentHero.damage).toBe(0);
            expect(this.ardentHero.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
    });
});
