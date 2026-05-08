describe('Monster Zero', function () {
    describe("Monster Zero's persistent effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['monster-zero', 'monster-zero2'],
                    inPlay: ['troll', 'urchin']
                },
                player2: {}
            });
            this.player1.play(this.monsterZero, true, true);
            this.player1.clickCard(this.urchin);
        });

        it("changes the house of Monster Zero's neighbors to Mars", function () {
            expect(this.troll.hasHouse('mars')).toBe(true);
            expect(this.troll.hasHouse('brobnar')).toBe(false);
            expect(this.urchin.hasHouse('mars')).toBe(true);
            expect(this.urchin.hasHouse('shadows')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Monster Zero's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['monster-zero', 'monster-zero2'],
                    inPlay: ['troll', 'snufflegator']
                },
                player2: {}
            });
        });

        it("adds power counters equal to the most powerful friendly creature's power", function () {
            this.player1.play(this.monsterZero);
            expect(this.monsterZero.power).toBe(9);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Monster Zero's keywords", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['monster-zero', 'monster-zero2'],
                    inPlay: ['troll', 'snufflegator']
                },
                player2: {}
            });

            this.monsterZeroBottom = this.player1.hand[0];
            this.monsterZeroTop = this.player1.hand[1];
        });

        it('should deploy between the existing creatures when top is played', function () {
            expect(this.monsterZeroTop.hasKeyword('deploy')).toBe(false);
            expect(this.monsterZeroBottom.hasKeyword('deploy')).toBe(true);

            this.player1.clickCard(this.monsterZeroTop, 'hand');
            this.player1.clickPrompt('Play this creature');
            expect(this.player1).toHavePromptButton('Deploy Left');
            expect(this.player1).toHavePromptButton('Deploy Right');
            this.player1.clickPrompt('Deploy Right');
            this.player1.clickCard(this.troll);

            expect(this.player1.player.creaturesInPlay).toEqual([
                this.troll,
                this.monsterZeroTop,
                this.snufflegator
            ]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deploy between the existing creatures when bottom is played', function () {
            expect(this.monsterZeroTop.hasKeyword('deploy')).toBe(false);
            expect(this.monsterZeroBottom.hasKeyword('deploy')).toBe(true);

            this.player1.clickCard(this.monsterZeroBottom, 'hand');
            this.player1.clickPrompt('Play this creature');
            expect(this.player1).toHavePromptButton('Deploy Left');
            expect(this.player1).toHavePromptButton('Deploy Right');
            this.player1.clickPrompt('Deploy Left');
            this.player1.clickCard(this.snufflegator);

            expect(this.player1.player.creaturesInPlay).toEqual([
                this.troll,
                this.monsterZeroBottom,
                this.snufflegator
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Monster Zero's Deploy keyword with put into play", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['æmberlution', 'troll', 'snufflegator', 'monster-zero', 'monster-zero2']
                },
                player2: {}
            });
            this.monsterZeroBottom = this.player1.hand[3];
            this.monsterZeroTop = this.player1.hand[4];
        });

        it('can put into play and deploy Monster Zero top between two existing creatures put into play', function () {
            this.player1.play(this.æmberlution);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('right');
            expect(this.player1.player.creaturesInPlay).toEqual([this.troll, this.snufflegator]);

            // Now put Monster Zero into play; deploy options should be available
            this.player1.clickCard(this.monsterZeroTop);
            expect(this.player1).toHavePromptButton('Deploy Left');
            expect(this.player1).toHavePromptButton('Deploy Right');
            this.player1.clickPrompt('Deploy Right');
            this.player1.clickCard(this.troll);

            expect(this.player1.player.creaturesInPlay).toEqual([
                this.troll,
                this.monsterZeroTop,
                this.snufflegator
            ]);
        });

        it('can put into play and deploy Monster Zero bottom between two existing creatures put into play', function () {
            this.player1.play(this.æmberlution);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('right');
            expect(this.player1.player.creaturesInPlay).toEqual([this.troll, this.snufflegator]);

            // Now put Monster Zero into play; deploy options should be available
            this.player1.clickCard(this.monsterZeroBottom);
            expect(this.player1).toHavePromptButton('Deploy Left');
            expect(this.player1).toHavePromptButton('Deploy Right');
            this.player1.clickPrompt('Deploy Right');
            this.player1.clickCard(this.troll);

            expect(this.player1.player.creaturesInPlay).toEqual([
                this.troll,
                this.monsterZeroBottom,
                this.snufflegator
            ]);
        });
    });
});
