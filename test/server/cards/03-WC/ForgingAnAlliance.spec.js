describe('Forging An Alliance', function () {
    describe("Forging An Alliance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'staralliance',
                    hand: ['forging-an-alliance', 'virtuous-works', 'chuff-ape'],
                    inPlay: ['sequis', 'mindwarper', 'blypyp']
                },
                player2: {
                    inPlay: ['zorg']
                }
            });
        });
        it('should not prompt to forge when the player has insufficient amber', function () {
            this.player1.play(this.forgingAnAlliance);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
    describe("Forging An Alliance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 9,
                    house: 'staralliance',
                    hand: ['forging-an-alliance', 'virtuous-works', 'chuff-ape'],
                    inPlay: ['sequis', 'mindwarper', 'blypyp']
                },
                player2: {
                    inPlay: ['zorg', 'batdrone']
                }
            });
        });
        it('should forge a key when the player has sufficient amber [10]', function () {
            this.player1.play(this.forgingAnAlliance);
            this.player1.clickPrompt('Red');
            expect(this.player1.amber).toBe(0);
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
    describe("Forging An Alliance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'staralliance',
                    hand: ['forging-an-alliance', 'virtuous-works', 'chuff-ape'],
                    inPlay: ['sequis', 'mindwarper', 'blypyp', 'lieutenant-khrkhar']
                },
                player2: {
                    inPlay: ['spyyyder', 'batdrone', 'rustgnawer']
                }
            });
        });
        it('should forge a key when the player has sufficient amber [7]', function () {
            this.player1.play(this.forgingAnAlliance);
            this.player1.clickPrompt('Red');
            expect(this.player1.amber).toBe(0);
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
    describe("Forging An Alliance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'staralliance',
                    hand: ['forging-an-alliance', 'virtuous-works', 'force-field'],
                    inPlay: ['sequis', 'mindwarper']
                },
                player2: {
                    inPlay: ['spyyyder', 'batdrone', 'rustgnawer']
                }
            });
        });
        it('should forge a key when the player has sufficient amber [7], considering upgrade', function () {
            this.player1.playUpgrade(this.forceField, this.sequis);
            this.player1.play(this.forgingAnAlliance);
            this.player1.clickPrompt('Red');
            expect(this.player1.amber).toBe(1);
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
