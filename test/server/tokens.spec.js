describe('Token', function () {
    describe("'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'prospector',
                    hand: [
                        'hire-on',
                        'generous-offer',
                        'forced-retirement',
                        'antiquities-dealer',
                        'dthoshră-recruiter'
                    ]
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should prompt placement with the name of the token', function () {
            this.player1.moveCard(this.antiquitiesDealer, 'deck');
            this.player1.playCreature(this.dthoshrăRecruiter);
            this.player1.play(this.hireOn);
            expect(this.player1).toHavePrompt('Prospector');
            expect(this.player1).toHavePromptImage('prospector');
            this.player1.clickPrompt('Left');
        });

        it('should make no token if the deck is empty', function () {
            this.player1.player.deck = [];
            this.player1.play(this.hireOn);
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should lose token abilities after destroyed', function () {
            let token = this.antiquitiesDealer;
            this.player1.moveCard(token, 'deck');
            this.player1.play(this.hireOn, true);
            expect(token.name).toBe('Prospector');
            expect(token.location).toBe('play area');

            // Destroy the token, draw a card.
            let handSize = this.player1.hand.length;
            this.player1.play(this.generousOffer);
            this.player1.clickCard(token);
            expect(this.player1.hand.length).toBe(handSize - 1 + 1);
            expect(token.location).toBe('discard');

            // Replay as a regular creature.
            this.player1.moveCard(token, 'hand');
            this.player1.playCreature(token);
            expect(token.name).toBe('Antiquities Dealer');
            expect(token.location).toBe('play area');

            // Destroy it again, no draw this time.
            handSize = this.player1.hand.length;
            this.player1.play(this.forcedRetirement);
            this.player1.clickCard(token);
            expect(token.location).toBe('discard');
            expect(this.player1.hand.length).toBe(handSize - 1);
        });
    });
});

describe('ToC token creature armor', function () {
    const tocTokenCreatures = [
        ['catena-fiend', 0],
        ['facet', 0],
        ['snare', 0],
        ['thrall', 0],
        ['minion', 0],
        ['phantasm', 1],
        ['wrecker', 0],
        ['æmberologist', 0],
        ['alpha-gamma', 0],
        ['chronicler', 0],
        ['savant', 0],
        ['spydrone', 0],
        ['zealot', 0],
        ['guardian', 2],
        ['paragon', 1],
        ['sentinel', 0],
        ['stooge', 0],
        ['cleaner', 0],
        ['prowler', 0],
        ['yardbird', 0],
        ['wrangler', 0],
        ['aerialist', 0],
        ['corsair', 0],
        ['marketeer', 0],
        ['niffle-brute', 0],
        ['briar-instar', 0],
        ['steppe-wolf', 0],
        ['twilight-pixie', 0]
    ];

    tocTokenCreatures.forEach(([tokenId, expectedArmor]) => {
        describe(tokenId, function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        token: tokenId
                    },
                    player2: {}
                });
            });

            it('should have the correct printed armor when made', function () {
                const tokenCreature = this.player1.makeTokenCreature();

                expect(tokenCreature.isToken()).toBe(true);
                expect(tokenCreature.armor).toBe(expectedArmor);
                expect(tokenCreature.armorTotal).toBe(expectedArmor);
            });
        });
    });
});

describe('Token', function () {
    describe("'s ability for adaptive", function () {
        beforeEach(function () {
            this.setupTest({
                gameFormat: 'adaptive-bo1',
                player1: {
                    name: 'player1',
                    house: 'untamed',
                    token: 'prospector'
                },
                player2: {
                    name: 'player2',
                    hand: []
                }
            });
        });

        it('should swap the token during adaptive', function () {
            expect(this.player1.player.chains).toBe(1);
            expect(this.player1.player.tokenCard).toBe(undefined);
            expect(this.player2.player.tokenCard.name).toBe('Prospector');
        });
    });
});
