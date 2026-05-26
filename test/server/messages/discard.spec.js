describe('Discard Messages', function () {
    describe('discard card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['mindwarper']
                },
                player2: {}
            });
        });

        it('should log correct message when using discarding a card from hand', function () {
            this.player1.scrap(this.mindwarper);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe(['player1 discards Mindwarper']);
        });
    });

    describe('discard card with ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['troll'],
                    inPlay: ['feeding-pit']
                },
                player2: {}
            });
        });

        it('should log correct message when discarding a card using an ability', function () {
            this.player1.useAction(this.feedingPit);
            this.player1.clickCard(this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe(['player1 uses Feeding Pit to discard Troll']);
        });
    });

    describe('scrap ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['donor-vox'],
                    inPlay: ['zorg']
                },
                player2: {}
            });
        });

        it('should log correct message when using scrap ability', function () {
            this.player1.scrap(this.donorVox);
            this.player1.clickCard(this.zorg);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 discards Donor Vox',
                'player1 uses Donor Vox to place 2 +1 power counters on Zorg'
            ]);
        });
    });

    describe('random discard from opponent', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['mind-barb']
                },
                player2: {
                    hand: ['troll']
                }
            });
        });

        it('should log correct message when discarding opponent card at random', function () {
            this.player1.play(this.mindBarb);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Mind Barb',
                "player1 gains an amber due to Mind Barb's bonus icon",
                "player1 uses Mind Barb to randomly discard 1 card from player2's hand",
                'player2 randomly discards Troll from hand'
            ]);
        });
    });

    describe('random discard from both players', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['trihard', 'ember-imp', 'mother', 'dextre']
                },
                player2: {
                    hand: ['troll', 'charette', 'krump']
                }
            });
        });

        it('should log correct messages when both players discard at random', function () {
            this.player1.playCreature(this.trihard);
            this.player1.clickPrompt('Me');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Trihard',
                "player1 uses Trihard to randomly discard 1 card from player1's hand",
                `player1 randomly discards ${this.player1.discard[0].name} from hand`,
                "player1 uses Trihard to randomly discard 1 card from player2's hand",
                `player2 randomly discards ${this.player2.discard[0].name} from hand`
            ]);
        });
    });

    describe('random discard multiple cards from both players', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: [
                        'trihard',
                        'ember-imp',
                        'mind-barb',
                        'tocsin',
                        'charette',
                        'shooler',
                        'pit-demon'
                    ]
                },
                player2: {
                    hand: [
                        'troll',
                        'krump',
                        'anger',
                        'punch',
                        'tremor',
                        'pelf',
                        'gauntlet-of-command',
                        'iron-obelisk',
                        'smaaash'
                    ]
                }
            });
        });

        it('should log correct messages when both players discard multiple cards at random', function () {
            // Player1: 6 cards after playing trihard, 6/3=2 discards
            // Player2: 9 cards, 9/3=3 discards
            this.player1.playCreature(this.trihard);
            this.player1.clickPrompt('Me');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Trihard',
                "player1 uses Trihard to randomly discard 2 cards from player1's hand",
                `player1 randomly discards ${this.player1.discard[1].name} from hand`,
                `player1 randomly discards ${this.player1.discard[0].name} from hand`,
                "player1 uses Trihard to randomly discard 3 cards from player2's hand",
                `player2 randomly discards ${this.player2.discard[2].name} from hand`,
                `player2 randomly discards ${this.player2.discard[1].name} from hand`,
                `player2 randomly discards ${this.player2.discard[0].name} from hand`
            ]);
        });
    });

    describe('random discard from archives', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['tantadlin']
                },
                player2: {
                    inPlay: ['troll'],
                    archives: ['anger']
                }
            });
        });

        it('should log correct message when discarding from archives', function () {
            this.player1.fightWith(this.tantadlin, this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Tantadlin to make Tantadlin fight Troll',
                "player1 uses Tantadlin to randomly discard 1 card from player2's archives",
                'player2 randomly discards Anger from archives'
            ]);
        });
    });

    describe('discard entire hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['punctuated-equilibrium', 'dust-pixie', 'flaxia']
                },
                player2: {
                    hand: ['troll', 'anger']
                }
            });
        });

        it('should log correct messages when discarding entire hands', function () {
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Me');
            expect(this.player1).toHavePrompt('Select a card to discard');
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).isReadyToTakeAction();
            // Opponent discards randomly
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Punctuated Equilibrium',
                'player1 uses Punctuated Equilibrium to make each player discard their hand and then refill their hands',
                'player1 discards Dust Pixie from hand',
                'player1 discards Flaxia from hand',
                `player2 randomly discards ${this.player2.discard[1].name} from hand`,
                `player2 randomly discards ${this.player2.discard[0].name} from hand`,
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player2 draws 6 cards to refill their hand to 6 cards'
            ]);
        });
    });

    describe('discard top of deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['brine-reckoning'],
                    deck: ['urchin', 'urchin', 'urchin', 'urchin', 'urchin', 'urchin']
                },
                player2: {
                    deck: ['troll', 'troll', 'troll', 'troll', 'troll', 'troll']
                }
            });
            this.player1.player.deck = this.player1.player.deck.filter((c) => c.name === 'Urchin');
            this.player2.player.deck = this.player2.player.deck.filter((c) => c.name === 'Troll');
        });

        it("logs the cards discarded and which player's deck they came from", function () {
            this.player1.play(this.brineReckoning);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Brine Reckoning',
                "player1 gains an amber due to Brine Reckoning's bonus icon",
                "player1 uses Brine Reckoning to discard Urchin, Urchin, Urchin, Urchin, and Urchin from the top of player1's deck",
                "player1 uses Brine Reckoning to discard Troll, Troll, Troll, Troll, and Troll from the top of player2's deck"
            ]);
        });
    });

    describe('reaction with discard target (Wraith Construct)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['troll'],
                    inPlay: ['wraith-construct']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('logs a single discard message for an unconditional discard reaction', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 draws 5 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key. They have 0 amber. The current cost is 6 amber',
                'player2 chooses brobnar as their active house this turn',
                'player2 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player1 uses Wraith Construct to discard Troll',
                'player1 does not forge a key. They have 0 amber. The current cost is 6 amber',
                'player1 chooses geistoid as their active house this turn'
            ]);
        });
    });

    describe('discard then optional follow-up (Haunting Measures)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['haunting-measures'],
                    discard: ['troll', 'anger', 'krump', 'punch', 'tremor', 'pelf']
                },
                player2: {}
            });
        });

        it('logs the discard and the optional return-to-hand message', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.moveCard(this.tremor, 'deck');
            this.player1.moveCard(this.punch, 'deck');
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.troll, 'deck');
            this.player1.play(this.hauntingMeasures);
            this.player1.clickCard(this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Haunting Measures',
                "player1 gains an amber due to Haunting Measures's bonus icon",
                'player1 uses Haunting Measures to discard Troll, Anger, Krump, Punch, Tremor, and Pelf',
                'player1 uses Haunting Measures to return Troll to hand'
            ]);
        });
    });

    describe('discard with then gain amber (Munchling)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['eyegor'],
                    inPlay: ['munchling']
                },
                player2: {
                    inPlay: ['helper-bot']
                }
            });
        });

        it('logs the discard once when used in a fight', function () {
            this.player1.fightWith(this.munchling, this.helperBot);
            this.player1.clickCard(this.eyegor);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Munchling to make Munchling fight Helper Bot',
                'Helper Bot is destroyed',
                'player1 uses Munchling to discard Eyegor'
            ]);
        });
    });
});
