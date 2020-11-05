import { dirname, resolve } from 'path';
import { groupBy, getLocaleName, stringifyMap } from '../src/utils';
import { DetectedLanguage, Result, TranslationResult } from '../src/translation-results';

test("UTILS: group by functions correctly", () => {
    const cars = [
        { brand: 'Audi', color: 'black' },
        { brand: 'Ferrari', color: 'red' },
        { brand: 'Ford', color: 'white' },
        { brand: 'Toyota', color: 'white' },
        { brand: 'Audi', color: 'white' },
    ];

    const audiCars = groupBy(cars, 'brand');
    expect(audiCars).toEqual({
        'Audi': [
            { brand: 'Audi', color: 'black' },
            { brand: 'Audi', color: 'white' }
        ],
        'Ferrari': [
            { brand: 'Ferrari', color: 'red' }
        ],
        'Ford': [
            { brand: 'Ford', color: 'white' }
        ],
        'Toyota': [
            { brand: 'Toyota', color: 'white' }
        ]
    });
});

test('UTILS: group by functions correctly with translation results', () => {
    const result: TranslationResult = {
        detectedLanguage: {
            language: 'en',
            score: 1.0
        } as DetectedLanguage,
        translations: [
            { to: 'fr', text: 'salut comment allez-vous?' },
            { to: 'fr', text: 'Je vous remercie' },
            { to: 'es', text: 'Te deseo todo lo mejor' },
            { to: 'fr', text: `Jusqu'à notre prochaine rencontre, prenez soin de vous` },
            { to: 'bg', text: 'Сламен танц, дефтони!' }
        ] as Result[]
    };

    const grouped = groupBy(result.translations, 'to');
    expect(grouped).toEqual({
        'fr': [
            { to: 'fr', text: 'salut comment allez-vous?' },
            { to: 'fr', text: 'Je vous remercie' },
            { to: 'fr', text: `Jusqu'à notre prochaine rencontre, prenez soin de vous` }
        ],
        'es': [
            { to: 'es', text: 'Te deseo todo lo mejor' }
        ],
        'bg': [
            { to: 'bg', text: 'Сламен танц, дефтони!' }
        ]
    });
});

test('UTILS: get locale file name correctly swaps locale.', () => {
    const resourcePath = resolve(__dirname, "./data/Test.en.resx");
    const directory = dirname(resourcePath);
    const localePath = getLocaleName(resourcePath, 'fr');
    
    expect(localePath).toEqual(resolve(directory, 'Test.fr.resx'));
});

test('UTILS: JSON stringify map replacer.', () => {
    const map: Map<string, string> = new Map();
    map.set('1', 'one');
    map.set('2', 'two');
    
    const obj = {
        test: 'Sample',
        map
    };

    expect(JSON.stringify(obj, stringifyMap)).toEqual(`{"test":"Sample","map":{"dataType":"Map","value":[["1","one"],["2","two"]]}}`);
});