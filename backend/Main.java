public class Main{
    public static void main(String args[]){
        Pessoa p = new Pessoa("Luis", 34, "03667082525");  
        p.exibirInformacoes();
    }    
}

class Pessoa {

    private String nome;
    private int idade;
    private String cpf;

    public Pessoa(String nome, int idade, String cpf) {
        this.nome = nome;
        this.idade = idade;
        this.cpf = cpf;
    }

    public String getNome() {
        return nome;
    }

    public int getIdade() {
        return idade;
    }

    public String getCpf() {
        return cpf;
    }

    // Métodos setters
    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public void exibirInformacoes() {
        System.out.println("Nome: " + nome);
        System.out.println(" Idade: " + idade);
        System.out.println(" CPF: " + cpf);
    }

   
    public boolean ehMaiorDeIdade() {
        return idade >= 18;
    }
}
