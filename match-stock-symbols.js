const fs = require('fs');

// Read both files
const dukascopySymbols = JSON.parse(
  fs.readFileSync('./packages/investing/src/live-data/dukascopy-symbols.json', 'utf8')
);
const stockNamesData = JSON.parse(
  fs.readFileSync('./packages/investing/src/stock-names-data/stock-names.json', 'utf8')
);

// Create a map of company names to stock symbols
const nameToSymbol = new Map();
stockNamesData.forEach(([symbol, name]) => {
  // Normalize the name for matching
  const normalizedName = name.toLowerCase().trim();
  nameToSymbol.set(normalizedName, symbol);
});

// Update dukascopy symbols with stock symbols
let matchCount = 0;
let noMatchCount = 0;
const noMatches = [];

dukascopySymbols.forEach(item => {
  if (item.category === 'stocks') {
    const normalizedDukascopyName = item.name.toLowerCase().trim();

    // Try exact match first
    let stockSymbol = nameToSymbol.get(normalizedDukascopyName);

    // Try partial matching if no exact match
    if (!stockSymbol) {
      for (const [name, symbol] of nameToSymbol) {
        if (name.includes(normalizedDukascopyName) || normalizedDukascopyName.includes(name)) {
          stockSymbol = symbol;
          break;
        }
      }
    }

    if (stockSymbol) {
      item.stockSymbol = stockSymbol;
      matchCount++;
      console.log(`✓ Matched: ${item.name} -> ${stockSymbol}`);
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
console.log(`No matches: ${noMatchCount}`);
if (noMatches.length > 0) {
  console.log(`\nStocks without matches:`);
  noMatches.forEach(name => console.log(`  - ${name}`));
}
