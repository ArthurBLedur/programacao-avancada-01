// 1. Classe de Banco de Dados Concreta
class BancoDeDadosMySQL {
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

    calcularFrete(): number {
        return 15.0;
    }
}

class PedidoRepository {
    private db: BancoDeDadosMySQL;

    constructor(db: BancoDeDadosMySQL = new BancoDeDadosMySQL()) {
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

// 3. Interface de tarefas do pedido
interface ITarefasPedido {
    processarPagamento(): void;
    gerarNotaFiscal(): void;
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

// 5. Implementação para produtos digitais
class PedidoProdutoDigital extends Pedido implements ITarefasPedido {
    processarPagamento(): void {
        console.log("Pagamento processado online.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada.");
    }

    imprimirEtiquetaFisica(): void {
        throw new Error("Erro: Não é possível imprimir etiqueta para produto digital.");
    }
}
