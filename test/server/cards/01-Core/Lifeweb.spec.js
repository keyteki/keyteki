describe('Lifeweb', function () {
    describe("Lifeweb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'setup',
                player1: {
                    house: 'untamed',
                    inPlay: ['lamindra'],
                    hand: ['lifeweb', 'fanghouse', 'bigtwig', 'bumblebird'],
                    amber: 1
                },
                player2: {
                    inPlay: ['lamindra'],
                    hand: ['lifeweb', 'dodger', 'gamgee', 'fidgit'],
                    amber: 3
                }
            });

            this.lifeweb1 = this.player1.player.hand[0];
            this.lifeweb2 = this.player2.player.hand[0];
        });

        it('should not steal amber on first play', function () {
            this.player1.clickPrompt('untamed');
            this.player1.play(this.lifeweb1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });
    });

    describe("Lifeweb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['lamindra'],
                    hand: ['lifeweb', 'fanghouse', 'bigtwig', 'bumblebird'],
                    amber: 1
                },
                player2: {
                    inPlay: ['lamindra'],
                    hand: ['lifeweb', 'dodger', 'gamgee', 'fidgit'],
                    amber: 3
                }
            });

            this.lifeweb1 = this.player1.player.hand[0];
            this.lifeweb2 = this.player2.player.hand[0];
        });

        it('should not steal amber if opponent did not play any creature', function () {
            this.player1.play(this.lifeweb1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        describe('when opponent plays', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
            });

            it('less than 3 creatures, should not steal amber', function () {
                this.player2.play(this.fidgit);
                this.player2.play(this.gamgee);
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.play(this.lifeweb1);
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(3);
            });

            it('3 creatures, should steal 2 amber', function () {
                this.player2.play(this.fidgit);
                this.player2.play(this.gamgee);
                this.player2.play(this.dodger);
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.play(this.lifeweb1);
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(1);
            });
        });

        it('opponent should not steal amber if first player did not play any creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.lifeweb2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('opponent should not steal amber if first player played less than 2 creatures', function () {
            this.player1.play(this.bumblebird);
            this.player1.play(this.bigtwig);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.lifeweb2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('opponent should steal 1 amber if first player played 3 creatures, but only 1A is available', function () {
            this.player1.play(this.bumblebird);
            this.player1.play(this.fanghouse);
            this.player1.play(this.bigtwig);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.lifeweb2);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
        });
    });

    describe("Lifeweb's ability and upgrade-creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['teleporter-chief-tink'],
                    hand: ['securi-droid', 'securi-droid', 'securi-droid'],
                    amber: 3
                },
                player2: {
                    hand: ['lifeweb'],
                    amber: 0
                }
            });

            this.securiDroid1 = this.player1.player.hand[0];
            this.securiDroid2 = this.player1.player.hand[1];
            this.securiDroid3 = this.player1.player.hand[2];
        });

        it('should not count creatures played as upgrades as creatures for the requirement', function () {
            this.player1.playUpgrade(this.securiDroid1, this.teleporterChiefTink);
            this.player1.playUpgrade(this.securiDroid2, this.teleporterChiefTink);
            this.player1.playUpgrade(this.securiDroid3, this.teleporterChiefTink);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.lifeweb);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Lifeweb's ability and creature played outside of the main phase", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['strange-gizmo'],
                    hand: ['binate-rupture', 'jargogle', 'ember-imp', 'doc-bookton', 'bot-bookton'],
                    amber: 4
                },
                player2: {
                    hand: ['lifeweb'],
                    amber: 0
                }
            });
        });

        it('should count creatures played during start of turn', function () {
            this.player1.play(this.binateRupture);
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.emberImp);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            // Strange Gizmo causes Jargogle to play ember imp after forging a key
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('right');
            expect(this.emberImp.location).toBe('play area');
            this.player1.clickPrompt('logos');
            this.player1.play(this.docBookton);
            this.player1.play(this.botBookton);
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.play(this.lifeweb);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
