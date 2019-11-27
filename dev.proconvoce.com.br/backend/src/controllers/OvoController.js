const axios = require('axios')

class Item {
    constructor(nome, preco, fornecedor, dataPesquisa) {
        this.nome = nome;
        this.preco = preco;
        this.fornecedor = fornecedor;
        this.data = dataPesquisa;
    }
}

module.exports = {
    async index(req, res) {
        const response = await axios.get('http://itajuba.myscriptcase.com/scriptcase/devel/conf/grp/Procon/libraries/php/pesquisa_total.php?id=6&qtde=10');

        const vetorDeItems = [];
        const pesquisa_total = response.data.pesquisa_total[0];

        pesquisa_total.pesquisas.forEach(pesquisa => {
            let dataPesquisa = pesquisa.data_publicacao;
            pesquisa.items.forEach(item => {
                let itemLocal = new Item();

                itemLocal.nome = item.nome_produto;
                itemLocal.fornecedor = item.indices['fornecedor_menor'];
                itemLocal.preco = item.indices['menor_preco'];
                itemLocal.data = dataPesquisa;
                itemLocal.diferenca_menor_maior = item.indices['diferenca_menor_maior'];
                vetorDeItems.push(itemLocal);
            });
        });

        return (res.json(vetorDeItems))
    }

}