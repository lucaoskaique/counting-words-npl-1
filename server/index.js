import express from "express";
import natural from "natural";
import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Sentiment from "sentiment";
import cors from "cors";
import * as sw from "stopword"
import { categorizeText, analyzeTrend } from "./lib/pythonCode.js";
import ObjectsToCsv from "objects-to-csv";

const app = express();
const port = 3000;

app.use(cors())
app.use(express.static("public"));
app.use(express.json());

const sentiment = new Sentiment();
const NGrams = natural.NGrams;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const wordBook = xlsx.readFile(path.join(__dirname, "dados.xlsx"));
const sheetName = wordBook.SheetNames;
const sheet = wordBook.Sheets[sheetName[2]];
const sheetData = xlsx.utils.sheet_to_json(sheet);
const fullText = sheetData.map((data) => data["Motivos"]).join(" ");


let categorizedData = [];
let trendData = [];

async function main() {
  try {
    const tokens = tokenize(fullText);
    const frequency = analyzeFrequency(tokens);
    
    const filteredFrequency = Object.entries(frequency)
    .filter(([word, count]) => count > 10)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));
    
    const sentimentAnalysis = analyzeSentiment(fullText);
    const bigrams = generateNGrams(tokens, 2);
    const trigrams = generateNGrams(tokens, 3);

    const categorizedDataBuffer = await categorizeText(fullText);
    categorizedData = categorizedDataBuffer.toString();

    const trendDataBuffer = await analyzeTrend(sheetData);
    trendData = trendDataBuffer.toString();

    return {
      tokens,
      sentimentAnalysis,
      bigrams,
      trigrams,
      filteredFrequency,
    };
  } catch (error) {
    console.error("Erro ao analisar texto:", error);
  }
}

function tokenize(text) {
  
  const tokenizer = new natural.AggressiveTokenizerPt();
  const tokensAggressive = tokenizer.tokenize(text.toLowerCase());
  let tokens = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(" ");

    
  return removeStopWords(sw.removeStopwords(tokensAggressive, sw.porBr))
}

function removeStopWords(tokens) {
  const stopWords = [
    "kkkkkkkkkkkkkkkkkk",
    "fui",
    "dá",
    "vezes",
    "tá",
    "to",
    "tô",
    "tava",
    "estou",
    "estava",
    "estive",
    "estivera",
    "estarei",
    "estaria",
    "estou",
    "estava",
    "estive",
    "estivera",
    "estarei",
    "estaria",
    "estou",
    "estava",
    "estive",
    "estivera",
    "estarei",
    'já',
    'de',
    'a',
    'vi',
    "aí",
    "sem",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "que",
    "e",
    "do",
    "o",
    "da",
    "em",
    "um",
    "para",
    "com",
    "não",
    "uma",
    "os",
    "no",
    "se",
    "na",
    "por",
    "mais",
    "as",
    "dos",
    "como",
    "mas",
    "foi",
    "ao",
    "ele",
    "das",
    "seu",
    "sua",
    "ou",
    "você",
    "quando",
    "muito",
    "nos",
    "já",
    "eu",
    "também",
    "só",
    "pelo",
    "pela",
    "até",
    "isso",
    "ela",
    "entre",
    "era",
    "depois",
    "sem",
    "mesmo",
    "aos",
    "ter",
    "seus",
    "quem",
    "nas",
    "me",
    "esse",
    "eles",
    "está",
    "você",
    "tinha",
    "foram",
    "essa",
    "num",
    "nem",
    "suas",
    "meu",
    "às",
    "minha",
    "têm",
    "numa",
    "vc",
    "lá",
    "uns",
    "umas",
    "pelo",
    "la",
    "pelos",
    "elas",
    "que",
    "a",
    "o",
    "e",
    "é",
    "de",
    "do",
    "da",
    "em",
    "um",
    "para",
    "com",
    "não",
    "uma",
    "os",
    "no",
    "se",
    "na",
    "por",
    "mais",
    "as",
    "dos",
    "como",
    "mas",
    "foi",
    "ao",
    "ele",
    "das",
    "seu",
    "sua",
    "ou",
    "você",
    "quando",
    "muito",
    "nos",
    "já",
    "eu",
    "também",
    "só",
    "pelo",
    "pela",
    "até",
    "isso",
    "ela",
    "entre",
    "era",
    "depois",
    "sem",
    "mesmo",
    "aos",
    "ter",
    "seus",
    "quem",
    "nas",
    "me",
    "esse",
    "eles",
    "está",
    "você",
    "tinha",
    "foram",
    "essa",
    "num",
    "nem",
    "suas",
    "meu",
    "às",
    "minha",
    "têm",
    "numa",
    "vc",
    "lá",
    "uns",
    "umas",
    "pelo",
    "la",
    "pelos",
    "elas",
    "que",
    "pra",
    "são",
    "tem",
    "faz",
    "",
  ];
  return tokens.filter((token) => !stopWords.includes(token));
}

function analyzeFrequency(tokens) {
  let frequency = {};
  tokens.forEach((token) => {
    if (!frequency[token]) {
      frequency[token] = 1;
    } else {
      frequency[token]++;
    }
  });
  return frequency;
}

function analyzeSentiment(text) {
  return sentiment.analyze(text);
}

function generateNGrams(tokens, n) {
  return NGrams.ngrams(tokens, n);
}

async function createCsvFile(data, fileName) {
  try {
    const csv = new ObjectsToCsv(data);
    // Set the path to be outside of src and inside a folder named "files"
    const filePath = path.join(__dirname, './files', `${fileName}.csv`);
    
    // concat filename with path
    await csv.toDisk(filePath);
  } catch (error) {
    console.error("Error occurred while creating csv file: ", error.message);
    throw new Error(`Error: ${error.message}`);
  }
}

app.get("/data", async (req, res) => {
  try {
    // Aqui você pode processar seus dados e enviar para o front-end
    const { tokens, filteredFrequency, sentimentAnalysis, bigrams, trigrams } = await main();
    // Aqui você pode criar um arquivo CSV com os dados processados
    await createCsvFile(filteredFrequency, "filteredFrequency");

    
    res.json({ tokens, filteredFrequency, sentimentAnalysis, bigrams, trigrams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the data.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
