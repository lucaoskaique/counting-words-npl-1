import sys
import json

# Exemplo de função para categorizar textos
def categorize_text(text):
    categories = {'Condições de Trabalho': ['salário', 'horário', 'pausa'],
                  'Relações Interpessoais': ['colega', 'chefe', 'conflito'],
                  'Políticas da Empresa': ['regra', 'política', 'norma']}
    result = {'texto': text, 'categorias': []}
    for category, keywords in categories.items():
        if any(keyword in text for keyword in keywords):
            result['categorias'].append(category)
    return result

# Lendo dados de entrada
text = sys.stdin.read()

# Processando
result = categorize_text(text)

# Imprimindo o resultado em JSON
print(json.dumps(result, ensure_ascii=False))
