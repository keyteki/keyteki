# Card Generator

This script reads card text and converts it into code, to make it easier to implement new KeyForge sets. Some generated cards are fully functional, while others can only be partially converted (especially those with complex or unique effects).

## Structure

The script has 3 key parts:

- The script (\*.js files) - picks which cards to read and where to put the generated code
- The parser (\*.pegjs files) - this converts the card text into js objects
- The code generator (\*.njk files) - this converts the js objects into working code

### The script

The script is designed to quickly generate as much as possible - it reads in the data for every card in the game and generates full or partial implementations for each. The default options will read in the standard keyteki-json-data and output cards to ../game/generatedcards and ../game/partialcards depending on whether they are fully converted.

The --overwrite setting is used for testing the generator itself - it will OVERWRITE existing implementations in /game/cards ! This is not normally what you want, but you can then run the entire suite of unit tests and see how many the generator passes.

### The parser

This uses [PEG.js](https://pegjs.org/) to parse card text into objects - for example, Forced Retirement has the text

`Play: Destroy a creature. If you do, its controller gains 1A.`

This produces the output:

```json
[
  {
    "name": "bold",
    "trigger": "play",
    "actions": {
      "targets": [
        {
          "type": "creature",
          "mode": "exactly",
          "count": 1,
          "actions": [
            {
              "name": "destroy"
            }
          ]
        }
      ],
      "then": {
        "default": [
          {
            "name": "gainAmber",
            "amount": 1,
            "targetPlayer": "controller",
            "then": true
          }
        ]
      }
    }
  }
]
```

Theoretically, the game engine could also parse cards at runtime and interpret the json directly, without generating code - at present, there's no need for this. In future, the keyforge designers might dynamically combine cards, so there are thousands of unique cards or even cards completely unique to decks. Generating that many individual js implementations would not be practical.

This isn't entirely speculative either - The related game [SolForge Fusion](https://solforgefusion.com/cards) seems to have over 5000 cards in its first set alone!
This json output may also be useful to other tools that want to know the details of how a card works.

### The code generator

This takes the json output of the parser and converts it into working javascript - while it makes an effort to format that correctly and simplify out useless parts, it will rarely create the most elegant possible code (why have a function that always returns 1? Why set a value to 1 when that's already the default? etc. It doesn't know these things.)

## Adding support for new sets

To add support for a new set, try something like:

- Add the json data to keyteki-json-data and clean up any anomalies like weird punctuation or symbols
- Add an entry to expansionPaths in CardGenerator.js to tell it where to put the cards
- Add new traits, houses or card types to the relevant definitions in the parser - these are basically just lists
- Review the output, especially the partial cards folder to see if there are cards that could be generated with small changes, or if strange formatting is confusing the parser. It may be useful to enable the comments = short setting so it shows the parsed card json in the output.
- Implement additional parsing and formatting as needed for new mechanics. If you're updating the parser, copying it into [PEG.js](https://pegjs.org/online) and dropping card text into the input window is really helpful

### Unimplemented features

- Does not create poltergeist-friendly implementations of shard-like artifacts.
- Does not disable abilities that affect a card after it is destroyed if they leave the discard pile.
