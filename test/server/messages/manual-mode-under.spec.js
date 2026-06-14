describe('Manual Mode Place/Take Under Messages', function () {
    describe('placeFaceup / placeFacedown messages', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['niffle-ape'],
                    hand: ['titan-mechanic']
                },
                player2: {
                    inPlay: ['snufflegator'],
                    hand: ['lamindra']
                }
            });
            this.game.manualMode = true;
        });

        it('logs faceup placement under a self-controlled card by name', function () {
            this.player1.menuClick(this.niffleApe, {
                command: 'placeFaceup',
                menu: 'under'
            });
            this.player1.clickCard(this.titanMechanic);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 manually places Titan Mechanic faceup under Niffle Ape'
            ]);
        });

        it('logs facedown placement under a self-controlled card hiding the name', function () {
            // Facedown placements name only the host and obscure the placed
            // card so opponents can't read the log to learn what was hidden.
            this.player1.menuClick(this.niffleApe, {
                command: 'placeFacedown',
                menu: 'under'
            });
            this.player1.clickCard(this.titanMechanic);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 manually places a card facedown under Niffle Ape'
            ]);
        });

        it('logs faceup placement under an opponent-controlled card', function () {
            // The host belongs to player2; the message still names the
            // acting player and the host card so the opponent can audit
            // what was placed where.
            this.player1.menuClick(this.snufflegator, {
                command: 'placeFaceup',
                menu: 'under'
            });
            this.player1.clickCard(this.titanMechanic);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 manually places Titan Mechanic faceup under Snufflegator'
            ]);
        });

        it('logs facedown placement under an opponent-controlled card', function () {
            this.player1.menuClick(this.snufflegator, {
                command: 'placeFacedown',
                menu: 'under'
            });
            this.player1.clickCard(this.titanMechanic);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 manually places a card facedown under Snufflegator'
            ]);
        });
    });

    describe('takeChild messages', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['niffle-ape'],
                    hand: ['titan-mechanic']
                },
                player2: {
                    inPlay: ['snufflegator'],
                    hand: ['lamindra']
                }
            });
            this.game.manualMode = true;
        });

        it('logs faceup take from a self-controlled host by name', function () {
            this.player1.menuClick(this.niffleApe, {
                command: 'placeFaceup',
                menu: 'under'
            });
            this.player1.clickCard(this.titanMechanic);
            this.player1.menuClick(this.niffleApe, {
                command: 'takeChild',
                arg: this.titanMechanic.uuid,
                menu: 'under'
            });
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 manually places Titan Mechanic faceup under Niffle Ape',
                "player1 manually takes Titan Mechanic from under Niffle Ape into player1's hand"
            ]);
        });

        it('logs facedown take from a self-controlled host as a facedown card', function () {
            // Even the controller pulling their own facedown card back
            // gets logged as 'a facedown card' so the chat history
            // doesn't retroactively reveal what the opponent saw hidden.
            this.player1.menuClick(this.niffleApe, {
                command: 'placeFacedown',
                menu: 'under'
            });
            this.player1.clickCard(this.titanMechanic);
            this.player1.menuClick(this.niffleApe, {
                command: 'takeChild',
                arg: this.titanMechanic.uuid,
                menu: 'under'
            });
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 manually places a card facedown under Niffle Ape',
                "player1 manually takes a facedown card from under Niffle Ape into player1's hand"
            ]);
        });

        it('logs the host controller taking a faceup card placed by the opponent', function () {
            // player1 stashes their card under player2's creature; player2
            // (the host's controller) is the only one allowed to take it
            // back. The take message names player2 as the actor.
            this.player1.menuClick(this.snufflegator, {
                command: 'placeFaceup',
                menu: 'under'
            });
            this.player1.clickCard(this.titanMechanic);
            this.player2.menuClick(this.snufflegator, {
                command: 'takeChild',
                arg: this.titanMechanic.uuid,
                menu: 'under'
            });
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 manually places Titan Mechanic faceup under Snufflegator',
                "player2 manually takes Titan Mechanic from under Snufflegator into player1's hand"
            ]);
        });

        it('logs the host controller taking a facedown card placed by the opponent', function () {
            this.player1.menuClick(this.snufflegator, {
                command: 'placeFacedown',
                menu: 'under'
            });
            this.player1.clickCard(this.titanMechanic);
            this.player2.menuClick(this.snufflegator, {
                command: 'takeChild',
                arg: this.titanMechanic.uuid,
                menu: 'under'
            });
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 manually places a card facedown under Snufflegator',
                "player2 manually takes a facedown card from under Snufflegator into player1's hand"
            ]);
        });

        it('logs no take message when a non-controller attempts to take a child', function () {
            // The server-side guard rejects takeChild from a non-controller,
            // so only the placement message should appear.
            this.player1.menuClick(this.niffleApe, {
                command: 'placeFaceup',
                menu: 'under'
            });
            this.player1.clickCard(this.titanMechanic);
            this.player2.menuClick(this.niffleApe, {
                command: 'takeChild',
                arg: this.titanMechanic.uuid,
                menu: 'under'
            });
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 manually places Titan Mechanic faceup under Niffle Ape'
            ]);
        });
    });
});
