describe('Sir Marrows', function () {
    describe("Sir Marrows's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre']
                },
                player2: {
                    amber: 1,
                    inPlay: ['sir-marrows']
                }
            });
        });

        it("should capture an amber when opponent's reap", function () {
            this.player1.reap(this.dextre);
            expect(this.sirMarrows.amber).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Sir Marrows's and Ether Spider interaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 3,
                    inPlay: ['dextre']
                },
                player2: {
                    amber: 1,
                    inPlay: ['sir-marrows', 'ether-spider']
                }
            });
        });

        it('should place amber on Ether Spider', function () {
            this.player1.reap(this.dextre);
            expect(this.sirMarrows.amber).toBe(0);
            expect(this.etherSpider.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Sir Marrows's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 3,
                    inPlay: ['dextre', 'archimedes']
                },
                player2: {
                    amber: 3,
                    inPlay: ['sir-marrows', 'sir-marrows']
                }
            });

            this.sirMarrows1 = this.player2.player.creaturesInPlay[0];
            this.sirMarrows2 = this.player2.player.creaturesInPlay[1];
        });

        it('should capture just one amber, APC should select which Sir Marrows to capture', function () {
            this.player1.reap(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.sirMarrows1);
            expect(this.player1).toBeAbleToSelect(this.sirMarrows2);
            this.player1.clickCard(this.sirMarrows2);
            expect(this.sirMarrows1.amber).toBe(0);
            expect(this.sirMarrows2.amber).toBe(1);
            this.player1.reap(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.sirMarrows1);
            expect(this.player1).toBeAbleToSelect(this.sirMarrows2);
            this.player1.clickCard(this.sirMarrows1);
            expect(this.sirMarrows1.amber).toBe(1);
            expect(this.sirMarrows2.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
        });
    });

    describe("Sir Marrows and Po's Pixies interaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 5,
                    inPlay: ['dextre', 'archimedes', 'po-s-pixies']
                },
                player2: {
                    amber: 3,
                    inPlay: ['sir-marrows', 'sir-marrows']
                }
            });

            this.sirMarrows1 = this.player2.player.creaturesInPlay[0];
            this.sirMarrows2 = this.player2.player.creaturesInPlay[1];
        });

        it('should capture with each Sir Marrows, because amber comes from common supply', function () {
            this.player1.reap(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.sirMarrows1);
            expect(this.player1).toBeAbleToSelect(this.sirMarrows2);
            this.player1.clickCard(this.sirMarrows2);
            expect(this.sirMarrows1.amber).toBe(1);
            expect(this.sirMarrows2.amber).toBe(1);
            this.player1.reap(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.sirMarrows1);
            expect(this.player1).toBeAbleToSelect(this.sirMarrows2);
            this.player1.clickCard(this.sirMarrows1);
            expect(this.sirMarrows1.amber).toBe(2);
            expect(this.sirMarrows2.amber).toBe(2);
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(3);
        });
    });

    describe('Sir Marrows and Control interaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 5,
                    inPlay: ['dextre', 'archimedes', 'sir-marrows']
                },
                player2: {
                    amber: 3,
                    inPlay: ['sir-marrows'],
                    hand: ['hypnobeam']
                }
            });

            this.sirMarrows1 = this.player1.player.creaturesInPlay[2];
            this.sirMarrows2 = this.player2.player.creaturesInPlay[0];
        });

        it('should capture correctly when taken control', function () {
            this.player1.reap(this.dextre);
            expect(this.sirMarrows1.amber).toBe(0);
            expect(this.sirMarrows2.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.sirMarrows1);
            this.player2.clickPrompt('left');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.reap(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.sirMarrows1);
            expect(this.player1).toBeAbleToSelect(this.sirMarrows2);
            this.player1.clickCard(this.sirMarrows2);
            expect(this.sirMarrows1.amber).toBe(0);
            expect(this.sirMarrows2.amber).toBe(2);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
        });
    });
});
