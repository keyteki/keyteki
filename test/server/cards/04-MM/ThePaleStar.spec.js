describe('The Pale Star', function () {
    describe("The Pale Star's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'sanctum',
                    inPlay: ['the-pale-star', 'spyyyder', 'gub', 'lion-bautrem', 'wrath']
                },
                player2: {
                    amber: 5,
                    inPlay: [
                        'haedroth-s-wall',
                        'baldric-the-bold',
                        'bulwark',
                        'sequis',
                        'gatekeeper'
                    ]
                }
            });
        });

        it('when the pale star is not used, no power and armor are changed', function () {
            expect(this.spyyyder.power).toBe(2); // base: 2
            expect(this.gub.power).toBe(8); // base: 1, +5 tokens, +2 from Lion
            expect(this.lionBautrem.power).toBe(4); // base: 4
            expect(this.wrath.power).toBe(5); // base: 3, +2 from Lion

            expect(this.baldricTheBold.power).toBe(6); // base: 4, +2 from Wall
            expect(this.bulwark.power).toBe(4); // base: 4
            expect(this.sequis.power).toBe(4); // base: 4
            expect(this.gatekeeper.power).toBe(7); // base: 5, +2 from Wall

            expect(this.spyyyder.armor).toBe(0); // base: 0
            expect(this.gub.armor).toBe(0); // base: 0
            expect(this.lionBautrem.armor).toBe(1); // base: 1
            expect(this.wrath.armor).toBe(3); // base: 3

            expect(this.baldricTheBold.armor).toBe(4); // base: 2, +2 from Bulwark
            expect(this.bulwark.armor).toBe(2); // base: 2
            expect(this.sequis.armor).toBe(4); // base: 2, +2 from Bulwark
            expect(this.gatekeeper.armor).toBe(1); // base: 1
        });

        it('should be destroyed and set base power and armor', function () {
            this.player1.useAction(this.thePaleStar, true);
            expect(this.thePaleStar.location).toBe('discard');

            expect(this.spyyyder.power).toBe(1);
            expect(this.gub.power).toBe(1);
            expect(this.lionBautrem.power).toBe(1);
            expect(this.wrath.power).toBe(1);

            expect(this.baldricTheBold.power).toBe(1);
            expect(this.bulwark.power).toBe(1);
            expect(this.sequis.power).toBe(1);
            expect(this.gatekeeper.power).toBe(1);

            expect(this.spyyyder.armor).toBe(0);
            expect(this.gub.armor).toBe(0);
            expect(this.lionBautrem.armor).toBe(0);
            expect(this.wrath.armor).toBe(0);

            expect(this.baldricTheBold.armor).toBe(0);
            expect(this.bulwark.armor).toBe(0);
            expect(this.sequis.armor).toBe(0);
            expect(this.gatekeeper.armor).toBe(0);
        });
    });

    describe("The Pale Star's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'logos',
                    inPlay: ['spyyyder', 'gub', 'lion-bautrem', 'wrath'],
                    hand: ['mimic-gel', 'cyber-clone']
                },
                player2: {
                    amber: 5,
                    inPlay: ['the-pale-star']
                }
            });
        });

        it('should reduce power and armor of Mimic Gel and Cyber Clone', function () {
            this.player1.play(this.mimicGel);
            this.player1.clickCard(this.wrath);
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.wrath);
            expect(this.wrath.location).toBe('purged');

            // Spyyyder Gub Lion Mimic Clone

            expect(this.spyyyder.power).toBe(2); // base: 2
            expect(this.gub.power).toBe(8); // base: 1, +5 tokens, +2 from Lion
            expect(this.lionBautrem.power).toBe(4); // base: 4
            expect(this.mimicGel.power).toBe(5); // base: 3, +2 from Lion
            expect(this.cyberClone.power).toBe(5); // base: 5

            expect(this.spyyyder.armor).toBe(0); // base: 0
            expect(this.gub.armor).toBe(0); // base: 0
            expect(this.lionBautrem.armor).toBe(1); // base: 1
            expect(this.mimicGel.armor).toBe(3); // base: 3
            expect(this.cyberClone.armor).toBe(3); // base: 3

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.useAction(this.thePaleStar, true);
            expect(this.thePaleStar.location).toBe('discard');

            expect(this.spyyyder.power).toBe(1);
            expect(this.gub.power).toBe(1);
            expect(this.lionBautrem.power).toBe(1);
            expect(this.mimicGel.power).toBe(1);
            expect(this.cyberClone.power).toBe(1);

            expect(this.spyyyder.armor).toBe(0);
            expect(this.gub.armor).toBe(0);
            expect(this.lionBautrem.armor).toBe(0);
            expect(this.mimicGel.armor).toBe(0);
            expect(this.cyberClone.armor).toBe(0);
        });
    });

    describe("The Pale Star's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['auto-legionary']
                },
                player2: {
                    amber: 5,
                    inPlay: ['the-pale-star']
                }
            });
        });

        it('should reduce armor of Auto-Legionary', function () {
            this.player1.useAction(this.autoLegionary);
            this.player1.clickPrompt('Left');
            expect(this.autoLegionary.power).toBe(5);
            expect(this.autoLegionary.armor).toBe(0);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.useAction(this.thePaleStar, true);
            expect(this.thePaleStar.location).toBe('discard');

            expect(this.autoLegionary.power).toBe(1);
            expect(this.autoLegionary.armor).toBe(0);
        });
    });
});
