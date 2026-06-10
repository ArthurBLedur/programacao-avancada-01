// 1. Abstração e implementação de Banco de Dados
interface IBancoDeDados {
    salvar(dados: any): void;
}

class BancoDeDadosMySQL implements IBancoDeDados {
    salvar(dados: any): void {
        console.log("Salvando dados no MySQL...");
    }
}

// 2. Servicos com responsabilidades especificas
interface IPoliticaDesconto {
    calcular(valorTotal: number): number;
}

class DescontoClienteComum implements IPoliticaDesconto {
    calcular(_valorTotal: number): number {
        return 0;
    }
}

class DescontoClienteVip implements IPoliticaDesconto {
    calcular(valorTotal: number): number {
        return valorTotal * 0.20;
    }
}

class DescontoClienteEstudante implements IPoliticaDesconto {
    calcular(valorTotal: number): number {
        return valorTotal * 0.10;
    }
}

class DescontoClientePremium implements IPoliticaDesconto {
    calcular(valorTotal: number): number {
        return valorTotal * 0.15;
    }
}

class CalculadoraPedido {
    calcularDesconto(pedido: Pedido): number {
        return pedido.politicaDesconto.calcular(pedido.valorTotal);
    }

    calcularFrete(pedido: IPedidoComFrete): number {
        return pedido.calcularFrete();
    }
}

class PedidoRepository {
    private db: IBancoDeDados;

    constructor(db: IBancoDeDados) {
        this.db = db;
    }

    salvar(pedido: Pedido): void {
        this.db.salvar(pedido);
    }
}

class EmailPedidoService {
    enviarConfirmacao(): void {
        console.log("Enviando e-mail de confirmação para o cliente...");
    }
}

// 3. Interfaces segregadas por responsabilidade
interface IPedidoPagavel {
    processarPagamento(): void;
}

interface IPedidoFaturavel {
    gerarNotaFiscal(): void;
}

interface IPedidoComFrete {
    calcularFrete(): number;
}

interface IPedidoComEtiquetaFisica {
    imprimirEtiquetaFisica(): void;
}

// 4. Classe principal de Pedido
class Pedido {
    public valorTotal: number;
    public politicaDesconto: IPoliticaDesconto;

    constructor(valorTotal: number, politicaDesconto: IPoliticaDesconto = new DescontoClienteComum()) {
        this.valorTotal = valorTotal;
        this.politicaDesconto = politicaDesconto;
    }
}

// 5. Implementação para produtos físicos
class PedidoProdutoFisico extends Pedido implements IPedidoPagavel, IPedidoFaturavel, IPedidoComFrete, IPedidoComEtiquetaFisica {
    processarPagamento(): void {
        console.log("Pagamento processado.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal gerada.");
    }

    calcularFrete(): number {
        return 15.0;
    }

    imprimirEtiquetaFisica(): void {
        console.log("Etiqueta física impressa.");
    }
}

// 6. Implementação para produtos digitais
class PedidoProdutoDigital extends Pedido implements IPedidoPagavel, IPedidoFaturavel {
    processarPagamento(): void {
        console.log("Pagamento processado online.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada.");
    }
}

// 7. Exemplo de composição das dependências
const bancoDeDados = new BancoDeDadosMySQL();
const pedidoRepository = new PedidoRepository(bancoDeDados);

/*
Justificativa das mudanças arquiteturais:

1. SRP: a classe Pedido ficou responsável apenas pelos dados do pedido.
   Cálculos, persistência e envio de e-mail foram extraídos para
   CalculadoraPedido, PedidoRepository e EmailPedidoService.

2. OCP: os descontos passaram a usar a interface IPoliticaDesconto.
   Novos tipos de cliente, como PREMIUM, podem ser adicionados criando uma
   nova classe de desconto, sem alterar CalculadoraPedido.

3. LSP: PedidoProdutoDigital não implementa mais comportamentos que não
   consegue cumprir, como frete ou etiqueta física. Assim ele pode substituir
   Pedido nas operações comuns sem lançar exceções inesperadas.

4. ISP: a interface genérica de tarefas foi separada em interfaces menores:
   IPedidoPagavel, IPedidoFaturavel, IPedidoComFrete e
   IPedidoComEtiquetaFisica. Cada classe implementa apenas as capacidades que
   realmente possui.

5. DIP: PedidoRepository depende da abstração IBancoDeDados, recebida por
   injeção no construtor, em vez de instanciar diretamente BancoDeDadosMySQL.
   Isso facilita trocar o banco e criar testes com implementações falsas.
*/

// 8. Exemplos de uso para executar o código
const calculadoraPedido = new CalculadoraPedido();
const emailPedidoService = new EmailPedidoService();

const pedidoFisicoVip = new PedidoProdutoFisico(200, new DescontoClienteVip());
const pedidoDigitalPremium = new PedidoProdutoDigital(100, new DescontoClientePremium());

console.log("Pedido físico VIP");
console.log("Desconto:", calculadoraPedido.calcularDesconto(pedidoFisicoVip));
console.log("Frete:", calculadoraPedido.calcularFrete(pedidoFisicoVip));
pedidoFisicoVip.processarPagamento();
pedidoFisicoVip.gerarNotaFiscal();
pedidoFisicoVip.imprimirEtiquetaFisica();
pedidoRepository.salvar(pedidoFisicoVip);
emailPedidoService.enviarConfirmacao();

console.log("--------------------");

console.log("Pedido digital PREMIUM");
console.log("Desconto:", calculadoraPedido.calcularDesconto(pedidoDigitalPremium));
pedidoDigitalPremium.processarPagamento();
pedidoDigitalPremium.gerarNotaFiscal();
pedidoRepository.salvar(pedidoDigitalPremium);
emailPedidoService.enviarConfirmacao();
