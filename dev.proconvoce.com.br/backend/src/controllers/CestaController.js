const axios = require('axios')

class Item {
    constructor(nome, preco, fornecedor, dataPesquisa, media) {
        this.nome = nome;
        this.preco = preco;
        this.fornecedor = fornecedor;
        this.data = dataPesquisa;
        this.media = media;
    }
}

module.exports = {
    async index(req, res) {
        const response = await axios.get('http://itajuba.myscriptcase.com/scriptcase/devel/conf/grp/Procon/libraries/php/pesquisa_total.php?id=2&qtde=1');

        const cesta = {}
        const pesquisa_total = response.data.pesquisa_total[0];
        
        pesquisa_total.pesquisas.forEach(pesquisa => {
        
            cesta.data = pesquisa.data_publicacao;
            cesta.cesta_barata = pesquisa['cesta_barata'];
            cesta.ranking_cesta = pesquisa['ranking_cesta'];
            cesta.itens = pesquisa["items"]
            console.log(cesta.itens);
        });
        

        return (res.json(cesta))
    }

}