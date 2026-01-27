describe('Kretchee', function () {
    describe("Kretchee's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'saurian',
                    inPlay: ['kretchee', 'citizen-shrix']
                },
                player2: {
                    amber: 3,
                    inPlay: ['snarette'],
                    hand: ['charette']
                }
            });
        });

        it('should add one amber when friendly creature exalts', function () {
            this.player1.reap(this.citizenShrix);
            expect(this.citizenShrix.amber).toBe(2);
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should add one amber when enemy creature captures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.charette);
            expect(this.charette.amber).toBe(4);
            expect(this.player1.amber).toBe(3);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.snarette.amber).toBe(2);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Kretchee's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'brobnar',
                    inPlay: ['kretchee', 'alaka', 'senator-quintina'],
                    hand: ['kretchee']
                },
                player2: {
                    amber: 3
                }
            });
            this.kretchee1 = this.player1.inPlay[0];
            this.kretchee2 = this.player1.player.hand[0];
        });

        it('should stack', function () {
            this.player1.play(this.kretchee2);
            this.player1.reap(this.alaka);
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.kretchee1);
            expect(this.player1).toBeAbleToSelect(this.kretchee2);
            this.player1.clickCard(this.kretchee1);
            expect(this.alaka.amber).toBe(3);
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Kretchee's ability with Ether Spider", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['kretchee', 'troll']
                },
                player2: {
                    inPlay: ['ether-spider']
                }
            });
        });

        it('should trigger when amber is captured by Ether Spider', function () {
            this.player1.reap(this.troll);
            expect(this.etherSpider.amber).toBe(2);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Kretchee's ability with multiple amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['kretchee', 'cornicen-octavia']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should trigger once per capture', function () {
            this.player1.useAction(this.cornicenOctavia);
            expect(this.cornicenOctavia.amber).toBe(3);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Kretchee's ability with multiple amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['kretchee', 'troll'],
                    hand: ['veil-of-ectoplasm'],
                    discard: ['echofly', 'boiler', 'infiltrator']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('trigger once per capture', function () {
            this.player1.play(this.veilOfEctoplasm);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.kretchee.amber).toBe(0);
            expect(this.troll.amber).toBe(4);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Kretchee's ability with a second Kretchee", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['securi-droid', 'kretchee', 'kretchee'],
                    hand: ['essence-entangler']
                },
                player2: {
                    inPlay: ['ether-spider']
                }
            });
            this.kretchee1 = this.player1.inPlay[1];
            this.kretchee2 = this.player1.inPlay[2];
        });

        it('should be orderable', function () {
            // Essence Entangler pip + 2 Kretchee
            this.etherSpider.amber = 2;
            8;
            this.player1.playUpgrade(this.essenceEntangler, this.etherSpider); // 3 on Ether Spider
            expect(this.essenceEntangler.parent).toBe(this.etherSpider);
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.kretchee1); // 4 on Ether Spider
            expect(this.player1).toBeAbleToSelect(this.kretchee2); // 5 on Ether Spider
            this.player1.clickCard(this.kretchee1);
            expect(this.etherSpider.power).toBe(2);
            expect(this.player1).isReadyToTakeAction();

            // Reap + 2 Kretchee
            this.player1.reap(this.securiDroid); // 6 on Ether Spider
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.kretchee1);
            expect(this.player1).toBeAbleToSelect(this.kretchee2);
            this.player1.clickCard(this.kretchee2); // 7 on Ether Spider - dies
            // Kretchee 1 fizzles
            expect(this.etherSpider.location).toBe('discard');
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Kretchee's ability with move aember", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['censor-philo', 'kretchee'],
                    hand: ['chant-of-hubris']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not trigger Kretchee', function () {
            this.censorPhilo.amber = 2;
            this.player1.play(this.chantOfHubris);
            this.player1.clickCard(this.censorPhilo);
            this.player1.clickCard(this.troll);
            expect(this.censorPhilo.amber).toBe(1);
            expect(this.troll.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
