# keyteki-json-data

Card data used by The Crucible / keyteki. Each JSON file in the `packs` directory should correspond to a pack or expansion for Keyforge.

## Getting started

```
npm install
```

## Validating

To validate all card data against the schema, run:

```
npm test
```

## Importing from the keyforge API

Once the pack data is available on the Keyforge website, it can be imported to the keyteki-json-data format by running:

```
npm run import packs/packFileName.json packcode
# Example: npm run import packs/AoA.json AoA
```

Optional step: To load different locales, pass the language code as an argument ('en', 'es', 'it', 'de', 'fr', 'pl', 'pt', 'th', 'zh-hans', 'zh-hant'):

```
npm run import packs/packFileName.json packcode
# Examples:
# npm run import packs/AoA.json AoA pt
# npm run import packs/AoA.json AoA fr
# npm run import packs/AoA.json AoA zh-hans
# npm run import packs/AoA.json AoA zh-hant
```

English is the default language.

The local pack file must already exist - the import script uses the the `id` field in the pack data to look up the corresponding data on the Keyforge website.

The initial local pack does not need the locale information. Import script will complete this information.
