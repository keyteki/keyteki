describe('Mimicry', function () {
    describe("Mimicry's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['batdrone', 'ancient-bear'],
                    hand: ['mimicry'],
                    discard: ['snufflegator']
                },
                player2: {
                    amber: 5,
                    discard: [
                        'neuro-syphon',
                        'wild-wormhole',
                        'interdimensional-graft',
                        'binate-rupture',
                        'swindle'
                    ]
                }
            });
            this.player1.moveCard(this.snufflegator, 'deck');
        });

        it('should work correctly with Neuro Syphon', function () {
            this.player1.play(this.mimicry);
            expect(this.player1).toHavePrompt('Mimicry');
            expect(this.player1).toBeAbleToSelect(this.neuroSyphon);
            this.player1.clickCard(this.neuroSyphon);
            expect(this.mimicry.location).toBe('discard');
            expect(this.neuroSyphon.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.hand.length).toBe(1);
        });

        it('should work correctly with Wild Wormhole', function () {
            this.player1.play(this.mimicry);
            expect(this.player1).toHavePrompt('Mimicry');
            expect(this.player1).toBeAbleToSelect(this.wildWormhole);
            this.player1.clickCard(this.wildWormhole);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Snufflegator');
            this.player1.clickPrompt('Left');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.snufflegator.controller).toBe(this.player1.player);
            expect(this.player1.player.cardsInPlay).toContain(this.snufflegator);
        });

        it('should consider enhancements on card', function () {
            this.interdimensionalGraft.enhancements = ['amber', 'draw', 'draw', 'capture'];
            this.player1.play(this.mimicry);
            expect(this.player1).toHavePrompt('Mimicry');
            expect(this.player1).toBeAbleToSelect(this.interdimensionalGraft);
            this.player1.clickCard(this.interdimensionalGraft);
            this.player1.clickCard(this.batdrone);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.batdrone.amber).toBe(1);
            expect(this.player1.hand.length).toBe(2);
        });

        it('should allow to select an alpha card', function () {
            this.player1.play(this.mimicry);
            expect(this.player1).toBeAbleToSelect(this.binateRupture);
            this.player1.clickCard(this.binateRupture);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(10);
            expect(this.mimicry.location).toBe('discard');
            expect(this.binateRupture.location).toBe('discard');
        });

        it('should allow to select an alpha card and end turn on omega', function () {
            this.player1.play(this.mimicry);
            expect(this.player1).toBeAbleToSelect(this.swindle);
            this.player1.clickCard(this.swindle);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.mimicry.location).toBe('discard');
            expect(this.swindle.location).toBe('discard');
            expect(this.player1).toHavePrompt('Waiting for opponent');
            expect(this.player2).toHavePrompt('House Choice');
        });

        it('should not play alpha card if not first thing in turn, but should allow selecting it', function () {
            this.player1.reap(this.ancientBear);
            this.player1.play(this.mimicry);
            expect(this.player1).toBeAbleToSelect(this.swindle);
            this.player1.clickCard(this.swindle);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(5);
            expect(this.mimicry.location).toBe('hand');
            expect(this.swindle.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Mimicry/Wild Wormhole interaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['wild-wormhole'],
                    inPlay: ['batdrone'],
                    discard: ['mimicry']
                },
                player2: {
                    amber: 5,
                    discard: ['neuro-syphon']
                }
            });
            this.player1.moveCard(this.mimicry, 'deck');
        });

        it('should work correctly', function () {
            this.player1.play(this.wildWormhole);
            expect(this.player1).toHavePrompt('Mimicry');
            expect(this.player1).toBeAbleToSelect(this.neuroSyphon);
            this.player1.clickCard(this.neuroSyphon);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.hand.length).toBe(1);
        });
    });

    describe('Mimicry/Information Exchange interaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['information-exchange'],
                    inPlay: ['batdrone'],
                    amber: 2
                },
                player2: {
                    amber: 5,
                    hand: ['mimicry']
                }
            });
        });

        it('should steal 2A if played in the next turn', function () {
            this.player1.play(this.informationExchange);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.mimicry);
            this.player2.clickCard(this.informationExchange);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(6);
        });
    });

    describe('Mimicry/Mars Need Amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['mimicry'],
                    inPlay: ['batdrone'],
                    amber: 2
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'brammo', 'alaka', 'zorg'],
                    discard: ['mars-needs-æmber']
                }
            });
            this.troll.damage = 1;
            this.alaka.damage = 2;
            this.zorg.damage = 1;
        });

        it('should make enemy capture amber', function () {
            this.player1.play(this.mimicry);
            this.player1.clickCard(this.marsNeedsÆmber);
            expect(this.player2.amber).toBe(3);
            expect(this.troll.amber).toBe(1);
            expect(this.alaka.amber).toBe(1);
            expect(this.brammo.amber).toBe(0);
            expect(this.zorg.amber).toBe(0);
        });
    });

    describe('Mimicry/City State Interest', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['city-state-interest'],
                    inPlay: ['batdrone', 'senator-shrix'],
                    amber: 5
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'brammo', 'alaka', 'flaxia'],
                    hand: ['mimicry']
                }
            });
        });

        it('should capture from opponent on own creatures', function () {
            this.player1.play(this.cityStateInterest);
            expect(this.player2.amber).toBe(0);
            expect(this.batdrone.amber).toBe(1);
            expect(this.senatorShrix.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.mimicry);
            this.player2.clickCard(this.cityStateInterest);
            expect(this.player1.amber).toBe(1);
            expect(this.troll.amber).toBe(1);
            expect(this.alaka.amber).toBe(1);
            expect(this.brammo.amber).toBe(1);
            expect(this.flaxia.amber).toBe(1);
        });
    });

    describe('Mimicry/Phloxem Spike', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['mimicry']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'brammo', 'alaka', 'zorg'],
                    discard: ['phloxem-spike']
                }
            });
        });

        it('should capture from opponent on own creatures', function () {
            this.player1.play(this.mimicry);
            this.player1.clickCard(this.phloxemSpike);
            expect(this.troll.location).toBe('play area');
            expect(this.brammo.location).toBe('discard');
            expect(this.alaka.location).toBe('discard');
            expect(this.zorg.location).toBe('play area');
        });
    });
});
