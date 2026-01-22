const fs = require("fs");

// Read both files
const dukascopySymbols = JSON.parse(
  fs.readFileSync(
    "./packages/investing/src/live-data/dukascopy-symbols.json",
    "utf8",
  ),
);
const stockNamesData = JSON.parse(
  fs.readFileSync(
    "./packages/investing/src/stock-names-data/stock-names.json",
    "utf8",
  ),
);

// Create a map of company names to stock symbols with various normalizations
const nameToSymbol = new Map();
const symbolToNames = new Map();

stockNamesData.forEach(([symbol, name]) => {
  const normalizedName = name.toLowerCase().trim();
  nameToSymbol.set(normalizedName, symbol);

  // Store all names for this symbol
  if (!symbolToNames.has(symbol)) {
    symbolToNames.set(symbol, []);
  }
  symbolToNames.get(symbol).push(normalizedName);

  // Also add without common suffixes
  const withoutSuffix = normalizedName
    .replace(/ inc\.?$/i, "")
    .replace(/ corp\.?$/i, "")
    .replace(/ ltd\.?$/i, "")
    .replace(/ plc\.?$/i, "")
    .replace(/ ag$/i, "")
    .replace(/ sa$/i, "")
    .replace(/ nv$/i, "")
    .replace(/ se$/i, "")
    .replace(/ ab$/i, "")
    .replace(/ as$/i, "")
    .replace(/ oyj$/i, "")
    .replace(/ class [a-z]$/i, "")
    .replace(/ - class [a-z]$/i, "")
    .replace(/-cl [a-z]$/i, "")
    .trim();

  if (withoutSuffix !== normalizedName) {
    nameToSymbol.set(withoutSuffix, symbol);
  }
});

// Normalize a name for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/ inc\.?$/i, "")
    .replace(/ corp\.?$/i, "")
    .replace(/ corporation$/i, "")
    .replace(/ ltd\.?$/i, "")
    .replace(/ limited$/i, "")
    .replace(/ plc\.?$/i, "")
    .replace(/ ag$/i, "")
    .replace(/ sa$/i, "")
    .replace(/ nv$/i, "")
    .replace(/ se$/i, "")
    .replace(/ ab$/i, "")
    .replace(/ as$/i, "")
    .replace(/ a\/s$/i, "")
    .replace(/ oyj$/i, "")
    .replace(/ class [a-z]$/i, "")
    .replace(/ - class [a-z]$/i, "")
    .replace(/-cl [a-z]$/i, "")
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .trim();
}

const Fuse = require("fuse.js");

// Create a list of candidates for Fuse
const candidates = [];
for (const [name, symbol] of nameToSymbol) {
  candidates.push({ name, symbol });
}

// Initialize Fuse
const fuse = new Fuse(candidates, {
  keys: ["name"],
  includeScore: true,
  threshold: 0.15, // Stricter threshold
  ignoreLocation: true, // Find matches anywhere in the string
});

// Update dukascopy symbols with stock symbols
let matchCount = 0;
let noMatchCount = 0;
let updatedCount = 0;
const noMatches = [];

dukascopySymbols.forEach((item) => {
  if (item.category === "stocks") {
    // Skip if already has stockSymbol
    // if (item.stockSymbol) {
    //   matchCount++;
    //   return;
    // }

    const normalizedDukascopyName = normalizeName(item.name);
    let stockSymbol = null;
    let matchQuality = 0;
    let matchedName = "";

    // Try exact match first
    stockSymbol = nameToSymbol.get(normalizedDukascopyName);
    if (stockSymbol) {
      matchQuality = 1.0;
      matchedName = normalizedDukascopyName;
    }

    // Try fuzzy matching if no exact match
    if (!stockSymbol) {
      const results = fuse.search(normalizedDukascopyName);
      if (results.length > 0) {
        const best = results[0];
        stockSymbol = best.item.symbol;
        matchQuality = 1 - best.score;
        matchedName = best.item.name;
      }
    }

    if (stockSymbol) {
      item.stockSymbol = stockSymbol;
      matchCount++;
      updatedCount++;
      console.log(
        `✓ Matched: ${item.name} -> ${stockSymbol} (${Math.round(matchQuality * 100)}%) [matched: "${matchedName}"]`,
      );
    } else {
      noMatchCount++;
      noMatches.push(item.name);
      console.log(`✗ No match: ${item.name}`);
    }
  }
});

// Write updated file
fs.writeFileSync(
  "./packages/investing/src/live-data/dukascopy-symbols.json",
  JSON.stringify(dukascopySymbols, null, 2),
  "utf8",
);

console.log(`\n=== Summary ===`);
console.log(`Total matches: ${matchCount}`);
console.log(`Newly updated: ${updatedCount}`);
console.log(`No matches: ${noMatchCount}`);
if (noMatches.length > 0 && noMatches.length <= 50) {
  console.log(`\nStocks without matches:`);
  noMatches.forEach((name) => console.log(`  - ${name}`));
}
