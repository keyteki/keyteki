describe('BleaForh', function () {
    describe("Blea-Forh's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['bleă-fŏrh', 'exeldon-yash', 'troll']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('can target an undamaged creature and auto-resolves with no exalt', function () {
            this.player1.fightWith(this.bleăFŏrh, this.urchin);
            expect(this.player1).toBeAbleToSelect(this.exeldonYash);
            this.player1.clickCard(this.exeldonYash);
            expect(this.exeldonYash.damage).toBe(0);
            expect(this.exeldonYash.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('heals 1 damage and exalts once', function () {
            this.exeldonYash.damage = 1;
            this.player1.fightWith(this.bleăFŏrh, this.urchin);
            this.player1.clickCard(this.exeldonYash);
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).not.toHavePromptButton('2');
            this.player1.clickPrompt('1');
            expect(this.exeldonYash.damage).toBe(0);
            expect(this.exeldonYash.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('heals 2 damage and exalts twice', function () {
            this.exeldonYash.damage = 2;
            this.player1.fightWith(this.bleăFŏrh, this.urchin);
            this.player1.clickCard(this.exeldonYash);
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).not.toHavePromptButton('3');
            this.player1.clickPrompt('2');
            expect(this.exeldonYash.damage).toBe(0);
            expect(this.exeldonYash.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can heal 0 from a damaged creature', function () {
            this.exeldonYash.damage = 2;
            this.player1.fightWith(this.bleăFŏrh, this.urchin);
            this.player1.clickCard(this.exeldonYash);
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).not.toHavePromptButton('3');
            this.player1.clickPrompt('0');
            expect(this.exeldonYash.damage).toBe(2);
            expect(this.exeldonYash.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can heal 1 from a creature with 3 damage and exalt once', function () {
            this.troll.damage = 3;
            this.player1.fightWith(this.bleăFŏrh, this.urchin);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).not.toHavePromptButton('3');
            this.player1.clickPrompt('1');
            expect(this.troll.damage).toBe(2);
            expect(this.troll.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can heal 2 from a creature with 3 damage and exalt twice', function () {
            this.troll.damage = 3;
            this.player1.fightWith(this.bleăFŏrh, this.urchin);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).not.toHavePromptButton('3');
            this.player1.clickPrompt('2');
            expect(this.troll.damage).toBe(1);
            expect(this.troll.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
