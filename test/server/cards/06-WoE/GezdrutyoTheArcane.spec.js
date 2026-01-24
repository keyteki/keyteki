describe('Gĕzdrutyŏ the Arcane', function () {
    describe("Gĕzdrutyŏ the Arcane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    token: 'scholar',
                    hand: ['senator-shrix'],
                    inPlay: ['gĕzdrutyŏ-the-arcane']
                },
                player2: {
                    amber: 5,
                    inPlay: ['gub', 'krump']
                }
            });

            this.player1.useAction(this.gĕzdrutyŏTheArcane);
        });

        it('should steal 2A and flip', function () {
            expect(this.player1.amber).toBe(3);
            expect(this.player1.amber).toBe(3);
            expect(this.gĕzdrutyŏTheArcane.name).toBe('Scholar');
        });

        describe('after becoming Scholar', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('dis');
                this.player2.endTurn();
                this.player1.clickPrompt('saurian');
            });

            it('should not be able to use action as Gezdrutyo', function () {
                this.player1.clickCard(this.gĕzdrutyŏTheArcane);
                expect(this.player1).toHavePromptButton('Reap with this creature');
                expect(this.player1).toHavePromptButton('Fight with this creature');
                expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
            });

            it('should draw a card after reap as Scholar', function () {
                expect(this.player1.hand.length).toBe(6);
                this.player1.reap(this.gĕzdrutyŏTheArcane);
                expect(this.player1.amber).toBe(4);
                expect(this.player1.hand.length).toBe(7);
                this.player1.endTurn();
            });
        });
    });

    describe('token creatures becoming Gĕzdrutyŏ', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    token: 'scholar',
                    hand: ['senator-shrix', 'mirror-shell'],
                    inPlay: ['gĕzdrutyŏ-the-arcane', 'scholar:aristotlmimus']
                },
                player2: {
                    amber: 5,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        /**
         * Because Gĕzdrutyŏ specifically says “flip facedown,” if a token
         * creature gets its ability it should _not_ flip face-up.
         */
        it('does not allow token creatures to flip face-up', function () {
            this.player1.playUpgrade(this.mirrorShell, this.gĕzdrutyŏTheArcane);
            this.player1.clickPrompt('left');
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            this.player1.clickPrompt('ekwidon');

            // After this reap, our Scholars become Gĕzdrutyŏs.
            this.player1.reap(this.gĕzdrutyŏTheArcane);
            // 2 from the reap
            expect(this.player1.amber).toBe(2);

            expect(this.scholar.name).toBe('Gĕzdrutyŏ the Arcane');
            expect(this.scholar.isToken()).toBe(true);

            this.player1.clickCard(this.scholar);
            this.player1.clickPrompt("Use this card's Action ability");
            // Stole 2 æmber
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);

            // Should not flip, should stay “facedown.”
            expect(this.scholar.isToken()).toBe(true);
        });
    });

    describe("Gĕzdrutyŏ the Arcane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'scholar',
                    inPlay: ['gĕzdrutyŏ-the-arcane']
                },
                player2: {
                    token: 'warrior',
                    inPlay: ['iron-heidy'],
                    hand: ['requisition-writ']
                }
            });
        });

        it("should flip into owner's token creature when opponent has token creature", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.playUpgrade(this.requisitionWrit, this.ironHeidy);
            this.player2.reap(this.ironHeidy);
            this.player2.clickCard(this.gĕzdrutyŏTheArcane);
            this.player2.clickPrompt('Right');
            this.player2.useAction(this.gĕzdrutyŏTheArcane);
            expect(this.gĕzdrutyŏTheArcane.isToken()).toBe(true);
            expect(this.gĕzdrutyŏTheArcane.name).toBe('Scholar');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe("Gĕzdrutyŏ the Arcane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'scholar',
                    inPlay: ['gĕzdrutyŏ-the-arcane']
                },
                player2: {
                    inPlay: ['iron-heidy'],
                    hand: ['requisition-writ']
                }
            });
        });

        it("should flip into owner's token creature when opponent does not have token creature", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.playUpgrade(this.requisitionWrit, this.ironHeidy);
            this.player2.reap(this.ironHeidy);
            this.player2.clickCard(this.gĕzdrutyŏTheArcane);
            this.player2.clickPrompt('Right');
            this.player2.useAction(this.gĕzdrutyŏTheArcane);
            expect(this.gĕzdrutyŏTheArcane.isToken()).toBe(true);
            expect(this.gĕzdrutyŏTheArcane.name).toBe('Scholar');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
