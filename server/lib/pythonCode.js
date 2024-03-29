import { spawn } from 'child_process';
import path from 'path';

const categoryAnalysisScriptPath = path.join('lib', 'categoryAnalisis.py');
const trendAnalysisScriptPath = path.join('lib', 'trendAnalysis.py');

// Exemplo de função para chamar o script Python de categorização
async function categorizeText(text) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [categoryAnalysisScriptPath]);

    
    pythonProcess.stdin.write(text);
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      resolve(data);
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(`Erro: ${data}`);
    });
  });
}

// Exemplo de função para chamar o script Python de análise de tendências
async function analyzeTrend(data) {
 return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [trendAnalysisScriptPath]);

    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      resolve(data);
      //console.log(`Tendências: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(`Erro: ${data}`);
    });
  });
}

export { categorizeText, analyzeTrend };
