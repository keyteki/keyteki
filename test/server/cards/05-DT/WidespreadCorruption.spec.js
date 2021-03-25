describe('Widespread Corruption', function () {
    describe("Widespread Corruptions's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'sanctum',
                    hand: ['sir-marrows', 'clear-mind'],
                    inPlay: ['bulwark', 'ardent-hero']
                },
                player2: {
                    amber: 1,
                    inPlay: ['shooler', 'lamindra', 'widespread-corruption']
                }
            });
        });

        it('should not affect amber from cards', function () {
            this.player1.play(this.clearMind);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            this.player1.endTurn();
        });

        it('should capture an amber when opponent reaps', function () {
            this.player1.reap(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.ardentHero);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
        });

        it('should capture an amber when controller reaps', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.lamindra);
            expect(this.player2).not.toBeAbleToSelect(this.shooler);
            expect(this.player2).not.toBeAbleToSelect(this.lamindra);
            expect(this.player2).toBeAbleToSelect(this.bulwark);
            expect(this.player2).toBeAbleToSelect(this.ardentHero);
            this.player2.clickCard(this.bulwark);
            expect(this.bulwark.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
        });

        it('should be able to capture an amber when controller reaps instead of Sir Marrows', function () {
            this.player1.play(this.sirMarrows);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.lamindra);
            expect(this.player2).toBeAbleToSelect(this.sirMarrows);
            expect(this.player2).toBeAbleToSelect(this.widespreadCorruption);
            this.player2.clickCard(this.widespreadCorruption);
            expect(this.player2).not.toBeAbleToSelect(this.shooler);
            expect(this.player2).not.toBeAbleToSelect(this.lamindra);
            expect(this.player2).toBeAbleToSelect(this.bulwark);
            expect(this.player2).toBeAbleToSelect(this.ardentHero);
            this.player2.clickCard(this.bulwark);
            expect(this.sirMarrows.amber).toBe(0);
            expect(this.bulwark.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            this.player2.endTurn();
        });

        it('should be able to capture an amber when controller on Sir Marrows', function () {
            this.player1.play(this.sirMarrows);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.lamindra);
            expect(this.player2).toBeAbleToSelect(this.sirMarrows);
            expect(this.player2).toBeAbleToSelect(this.widespreadCorruption);
            this.player2.clickCard(this.sirMarrows);
            this.player2.clickCard(this.bulwark);
            expect(this.sirMarrows.amber).toBe(1);
            expect(this.bulwark.amber).toBe(0);
            expect(this.ardentHero.amber).toBe(0);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            this.player2.endTurn();
        });
    });

    describe("Widespread Corruptions's and Ether Spider interaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 3,
                    inPlay: ['dextre']
                },
                player2: {
                    amber: 1,
                    inPlay: ['ether-spider', 'widespread-corruption']
                }
            });
        });

        it('should place amber on Ether Spider', function () {
            this.player1.reap(this.dextre);
            expect(this.etherSpider.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Widespread Corruption and Po's Pixies interaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 5,
                    inPlay: ['dextre', 'archimedes', 'po-s-pixies']
                },
                player2: {
                    amber: 3,
                    inPlay: ['widespread-corruption', 'widespread-corruption', 'halacor', 'flaxia']
                }
            });

            this.widespreadCorruption1 = this.player2.player.cardsInPlay[0];
            this.widespreadCorruption2 = this.player2.player.cardsInPlay[1];
        });

        it('should capture twice, because amber comes from common supply', function () {
            this.player1.reap(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.widespreadCorruption1);
            expect(this.player1).toBeAbleToSelect(this.widespreadCorruption2);
            this.player1.clickCard(this.widespreadCorruption1);
            expect(this.player1).toBeAbleToSelect(this.halacor);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.halacor);
            expect(this.player1).toBeAbleToSelect(this.halacor);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.halacor.amber).toBe(1);
            expect(this.flaxia.amber).toBe(1);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(3);
        });
    });
});
