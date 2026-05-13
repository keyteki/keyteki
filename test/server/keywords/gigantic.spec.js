describe('Gigantic Armor Debug', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'logos',
                hand: ['ultra-gravitron', 'ultra-gravitron2']
            },
            player2: {
                house: 'brobnar',
                inPlay: ['troll']
            }
        });
        this.player1.play(this.ultraGravitron);
    });

    it('should have armor token after entering play', function () {
        expect(this.ultraGravitron.armorTotal).toBe(3);
        expect(this.ultraGravitron.armor).toBe(3);
        expect(this.ultraGravitron.tokens.armor).toBe(3);
    });

    it('should reduce fight damage by armor', function () {
        this.player1.endTurn();
        this.player2.clickPrompt('brobnar');
        this.player2.fightWith(this.troll, this.ultraGravitron);
        // Troll has 4 power, armor 3, so 1 damage should get through
        expect(this.ultraGravitron.damage).toBe(1);
        // Troll should take 10 damage (UG power)
        expect(this.troll.location).toBe('discard');
    });

    it('should have correct armorPrinted on summary when played from part 1', function () {
        const summary = this.ultraGravitron.getSummary(this.player1.player);
        console.log('Part 1 played - armorPrinted:', summary.armorPrinted);
        console.log('Part 1 played - tokens.armor:', summary.tokens.armor);
        console.log('Part 1 played - armorTotal:', this.ultraGravitron.armorTotal);
    });

    it('should have correct armorPrinted on summary when played from part 2', function () {
        // Reset and play from part 2
        this.setupTest({
            player1: {
                house: 'logos',
                hand: ['ultra-gravitron', 'ultra-gravitron2']
            },
            player2: {
                house: 'brobnar',
                inPlay: ['troll']
            }
        });
        this.player1.play(this.ultraGravitron2);
        const summary = this.ultraGravitron2.getSummary(this.player1.player);
        console.log('Part 2 played - armorPrinted:', summary.armorPrinted);
        console.log('Part 2 played - tokens.armor:', summary.tokens.armor);
        console.log('Part 2 played - armorTotal:', this.ultraGravitron2.armorTotal);
        expect(this.ultraGravitron2.armor).toBe(3);
    });
});
