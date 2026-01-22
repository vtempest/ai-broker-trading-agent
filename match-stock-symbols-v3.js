const fs = require('fs');

// Read both files
const dukascopySymbols = JSON.parse(
  fs.readFileSync('./packages/investing/src/live-data/dukascopy-symbols.json', 'utf8')
);
const stockNamesData = JSON.parse(
  fs.readFileSync('./packages/investing/src/stock-names-data/stock-names.json', 'utf8')
);

// Manual mappings for common stocks that don't match well
const manualMappings = {
  'adobe systems inc': 'ADBE',
  'walt disney co/the': 'DIS',
  'facebook inc-a / meta': 'META',
  'alphabet inc-cl c': 'GOOG',
  'alphabet inc-cl a': 'GOOGL',
  'eli lilly & co': 'LLY',
  "lowe's cos inc": 'LOW',
  'merck & co. inc.': 'MRK',
  'procter & gamble co/the': 'PG',
  'schlumberger ltd': 'SLB',
  'southern co/the': 'SO',
  'twitter inc': 'TWTR',
  'walgreens boots alliance inc': 'WBA',
  "wendy's co/the": 'WEN',
  'xilinx inc': 'XLNX',
  'zillow group inc - c': 'Z',
  'under armour inc-class c': 'UA',
  'under armour inc-class a': 'UAA',
  'priceline group inc/the': 'BKNG',
  'paramount global-class b': 'PARA',
  'gap inc/the': 'GPS',
  'foot locker inc': 'FL',
  'kraft heinz co/the': 'KHC',
  'kellogg co': 'K',
  'hanesbrands inc': 'HBI',
  'conagra foods inc': 'CAG',
  'tyson foods inc-cl a': 'TSN',
  'travelers cos inc/the': 'TRV',
  'ansys inc': 'ANSS',
  'anthem inc': 'ANTM',
  'aon plc-class a': 'AON',
  'citrix systems inc': 'CTXS',
  'interpublic group of cos inc': 'IPG',
  'johnson controls inc': 'JCI',
  'nortonlifelock inc': 'NLOK',
  'workday inc-class a': 'WDAY',
  'twilio inc - a': 'TWLO',
  'splunk inc': 'SPLK',
  'dropbox inc-class a': 'DBX',
  'lyft inc-a': 'LYFT',
  'uber inc': 'UBER',
  'snowflake inc class a': 'SNOW',
  'square inc': 'SQ',
  'xpeng inc adr': 'XPEV',
  'anaplan inc': 'PLAN',
  'elastic nv': 'ESTC',
  'avalara inc': 'AVLR',
  'planet fitness inc - cl a': 'PLNT',
  'godaddy inc - class a': 'GDDY',
  'cboe global markets inc': 'CBOE',
  'fortune brands home & securi': 'FBHS',
  'mks instruments inc': 'MKSI',
  'berry global group inc': 'BERY',
  'cdk global inc': 'CDK',
  'pbf energy inc-class a': 'PBF',
  'continental resources inc/ok': 'CLR',
  'centennial resource develo-a': 'CDEV',
  'life storage inc': 'LSI',
  'virtu financial inc-class a': 'VIRT',
  'ulta salon cosmetics & fragr': 'ULTA',
  'bio-rad laboratories-a': 'BIO',
  'coherent inc': 'COHR',
  // European stocks
  'erste group bank ag': 'EBS',
  'ageas': 'AGS',
  'proximus': 'PROX',
  'solvay sa': 'SOLB',
  'ucb sa': 'UCB',
  'danske bank a/s': 'DANSKE',
  'ap moeller - maersk a/s': 'MAERSK',
  'pandora a/s': 'PNDORA',
  'neste oyj': 'NESTE',
  'nokian renkaat oyj': 'NOKIAN',
  'stora enso oyj': 'STERV',
  'air france-klm': 'AF',
  'air liquide sa': 'AI',
  'danone sa': 'BN',
  'bnp paribas sa': 'BNP',
  'axa sa': 'CS',
  'vinci sa': 'DG',
  'electricite de france sa': 'EDF',
  'engie': 'ENGI',
  'valeo sa': 'FR',
  'societe generale sa': 'GLE',
  'thales sa': 'HO',
  'lvmh moet hennessy louis vuitton sa': 'MC',
  'michelin sa': 'ML',
  "l'oreal sa": 'OR',
  'orange sa': 'ORA',
  'publicis groupe sa': 'PUB',
  'renault sa': 'RNO',
  'safran sa': 'SAF',
  'schneider electric sa': 'SU',
  'sodexo sa': 'SW',
  'adidas ag': 'ADS',
  'allianz se': 'ALV',
  'basf se': 'BAS',
  'bayer ag': 'BAYN',
  'beiersdorf ag': 'BEI',
  'brenntag se': 'BNR',
  'hugo boss ag': 'BOSS',
  'continental ag': 'CON',
  'covestro ag': 'COV',
  'daimler ag': 'DAI',
  'e.on se': 'EOAN',
  'heidelbergcement ag': 'HEI',
  'henkel ag & co kgaa': 'HEN',
  'merck kgaa': 'MRK',
  'mtu aero engines ag': 'MTX',
  'puma se': 'PUM',
  'qiagen nv': 'QIA',
  'rwe ag': 'RWE',
  'sar': 'SY',
  'siemens ag': 'SIE',
  'symrise ag': 'SY1',
  'thyssenkrupp ag': 'TKA',
  'volkswagen ag': 'VOW',
  'vonovia se': 'VNA',
  'wirecard ag': 'WDI',
  'zalando se': 'ZAL',
  'akzo nobel nv': 'AKZA',
  'arcelormittal': 'MT',
  'asml holding nv': 'ASML',
  'heineken nv': 'HEIA',
  'ing groep nv': 'INGA',
  'koninklijke ahold delhaize nv': 'AD',
  'koninklijke philips nv': 'PHIA',
  'prosus nv': 'PRX',
  'randstad nv': 'RAND',
  'relx nv': 'REN',
  'unilever nv': 'UNA',
  'wolters kluwer': 'WKL',
  'lonza group ag': 'LONN',
  'roche holding ag': 'ROG',
  'swiss re ag': 'SREN',
  'ubs group ag': 'UBSG',
  'zurich insurance group ag': 'ZURN',
  'astrazeneca plc': 'AZN',
  'aviva plc': 'AV',
  'barclays plc': 'BARC',
  'british american tobacco plc': 'BATS',
  'bt group plc': 'BT',
  'burberry group plc': 'BRBY',
  'coca-cola hbc ag': 'CCH',
  'diageo plc': 'DGE',
  'gvc holdings plc': 'GVC',
  'hsbc holdings plc': 'HSBA',
  'imperial brands plc': 'IMB',
  'intercontinental hotels group': 'IHG',
  'lloyds banking group plc': 'LLOY',
  'marks and spencer group plc': 'MKS',
  'national grid plc': 'NG',
  'pearson plc': 'PSON',
  'prudential plc': 'PRU',
  'reckitt benckiser group plc': 'RB',
  'rio tinto plc': 'RIO',
  'royal dutch shell plc': 'RDSA',
  'smiths group plc': 'SMIN',
  'vodafone group plc': 'VOD',
  'wpp plc': 'WPP',
};

// Create a map of company names to stock symbols
const nameToSymbol = new Map();
stockNamesData.forEach(([symbol, name]) => {
  nameToSymbol.set(name.toLowerCase().trim(), symbol);
});

// Normalize a name for matching
function normalizeName(name) {
  return name.toLowerCase()
    .replace(/\s+inc\.?$/i, '')
    .replace(/\s+corp\.?$/i, '')
    .replace(/\s+corporation$/i, '')
    .replace(/\s+ltd\.?$/i, '')
    .replace(/\s+limited$/i, '')
    .replace(/\s+plc\.?$/i, '')
    .replace(/\s+ag$/i, '')
    .replace(/\s+sa$/i, '')
    .replace(/\s+nv$/i, '')
    .replace(/\s+se$/i, '')
    .replace(/\s+ab$/i, '')
    .replace(/\s+as$/i, '')
    .replace(/\s+a\/s$/i, '')
    .replace(/\s+oyj$/i, '')
    .replace(/\s+class [a-z]$/i, '')
    .replace(/\s+-\s+class [a-z]$/i, '')
    .replace(/-cl [a-z]$/i, '')
    .replace(/\./g, '')
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();
}

// Update dukascopy symbols with stock symbols
let matchCount = 0;
let noMatchCount = 0;
let updatedCount = 0;
const noMatches = [];

dukascopySymbols.forEach(item => {
  if (item.category === 'stocks') {
    // Skip if already has stockSymbol
    if (item.stockSymbol) {
      matchCount++;
      return;
    }

    const normalizedDukascopyName = normalizeName(item.name);
    let stockSymbol = manualMappings[normalizedDukascopyName];

    if (stockSymbol) {
      item.stockSymbol = stockSymbol;
      matchCount++;
      updatedCount++;
      console.log(`✓ Manual match: ${item.name} -> ${stockSymbol}`);
    } else {
      noMatchCount++;
      noMatches.push(item.name);
      console.log(`✗ No match: ${item.name}`);
    }
  }
});

// Write updated file
fs.writeFileSync(
  './packages/investing/src/live-data/dukascopy-symbols.json',
  JSON.stringify(dukascopySymbols, null, 2),
  'utf8'
);

console.log(`\n=== Summary ===`);
console.log(`Total matches: ${matchCount}`);
console.log(`Newly updated: ${updatedCount}`);
console.log(`No matches: ${noMatchCount}`);
if (noMatches.length > 0 && noMatches.length <= 100) {
  console.log(`\nStocks still without matches:`);
  noMatches.forEach(name => console.log(`  - ${name}`));
}
