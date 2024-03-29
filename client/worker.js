self.onmessage = function(event) {
  // Receba os dados do script principal
  const data = event.data;

  // Processe os dados (por exemplo, crie o gráfico de nuvem de palavras)
  const processedData = processData(data);

  // Envie os dados processados de volta para o script principal
  self.postMessage(processedData);
};

function processData(data) {
  // Aqui vai o código para processar os dados
  let processedData = ... // Defina processedData aqui
  return processedData;
}