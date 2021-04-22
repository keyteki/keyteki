describe('Diplomat Agung', function () {
    describe('ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['scout-pete'],
                    inPlay: ['diplomat-agung', 'dust-pixie']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should prompt for house selection', function () {
            this.player1.reap(this.diplomatAgung);
            this.player1.clickPrompt('dis');
        });

        it('should prompt for card selection after house', function () {
            this.player1.reap(this.diplomatAgung);
            this.player1.clickPrompt('dis');
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
        });

        it('should prompt for house and creature and gain that house', function () {
            expect(this.dustPixie.hasHouse('untamed')).toBe(true);

            this.player1.reap(this.diplomatAgung);
            this.player1.clickPrompt('dis');
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.hasHouse('dis')).toBe(true);
            expect(this.dustPixie.hasHouse('untamed')).toBe(true);
            this.player1.endTurn();
        });

        it('should be able to use the creature by making it a sa creature', function () {
            this.player1.reap(this.diplomatAgung);
            this.player1.clickPrompt('staralliance');
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.hasHouse('staralliance')).toBe(true);
            expect(this.dustPixie.hasHouse('untamed')).toBe(true);
            this.player1.reap(this.dustPixie);
            this.player1.endTurn();
        });
    });

    describe('and Academy Training', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    hand: ['scout-pete', 'academy-training'],
                    inPlay: ['diplomat-agung', 'troll']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });

            this.player1.playUpgrade(this.academyTraining, this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
        });

        it('should add a house to a creature with Academy Training', function () {
            this.player1.reap(this.diplomatAgung);
            this.player1.clickPrompt('staralliance');
            this.player1.clickCard(this.troll);
            expect(this.troll.hasHouse('logos')).toBe(true);
            expect(this.troll.hasHouse('staralliance')).toBe(true);
            expect(this.troll.hasHouse('brobnar')).toBe(false);
        });

        it('should add the original house to a creature with Academy Training', function () {
            this.player1.reap(this.diplomatAgung);
            this.player1.clickPrompt('brobnar');
            this.player1.clickCard(this.troll);
            expect(this.troll.hasHouse('logos')).toBe(true);
            expect(this.troll.hasHouse('staralliance')).toBe(false);
            expect(this.troll.hasHouse('brobnar')).toBe(true);
        });
    });
});
