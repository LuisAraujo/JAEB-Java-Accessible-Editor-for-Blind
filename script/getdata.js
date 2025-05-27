/*SIMULANDO ATIVIDADE VINDA DO BANCO DE DADOS*/

description  = "Crie um programa em Java para somar dois inteiros e exibir na tela.";
currenteStep = 0;
steps = ["Crie uma classe pública de nome Main", "Crie a função public void main", "Declare duas variáveis para guardar os números inteiros.", "Declare uma terceira variável para guardar os resultados", "Atribua a soma dos dois números ao resultado. ", "Exiba o resultado na tela com println"];

function getOverviewDescription(){
    return description;
}

function getStepDescription(){
    return steps[currenteStep];
}

