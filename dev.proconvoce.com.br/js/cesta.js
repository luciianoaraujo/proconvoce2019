$(window).on('load', async () => {
    loadTableData('cesta');
    // btnArea();
})

$('#escolha').on('click', (e) => {
    $('#escolhaInfo').toggleClass('hide');
})
class Item {
    constructor(nome, preco, fornecedor, dataPesquisa, media) {
        this.nome = nome;
        this.preco = preco;
        this.fornecedor = fornecedor;
        this.data = dataPesquisa;
        this.media = media;
    }
}

async function loadTableData(query) {
    var url = `https://itajuba.myscriptcase.com/scriptcase/devel/conf/grp/Procon/libraries/php/pesquisa_total.php?id=2&qtde=1`;
    
    let i = 0;
    return await $.getJSON(url, (data) => {
        const cesta = {}
        
        const pesquisa_total = data.pesquisa_total[0];
        
        pesquisa_total.pesquisas.forEach(pesquisa => {
        
            cesta.data = pesquisa.data_publicacao;
            cesta.cesta_barata = pesquisa['cesta_barata'];
            cesta.ranking_cesta = pesquisa['ranking_cesta'];
            cesta.itens = pesquisa["items"]
            
        });
        
        $.each(cesta.ranking_cesta, function (key, value) {
            if(key < 3){
                makeDisplay('#displayRanking', value);
            }
        });
        
        $.each(cesta.itens, function (aux_key, aux_value) {
            console.log(aux_value)
            makeCards('#cardsArea', aux_value, aux_value.indices.media)
        });
    
        $('#preloader').remove()
        $('.menu').removeClass('hiden');
    })
}

function makeDisplay(displayName, value) {
    value.nome_fornecedor = value.nome_fornecedor.replace('SUPERMERCADO', '');
    let tag = `
    <div class='rank-item col-sm-12 col-md-4'>
        <h4 class='mt-4'>${value.nome_fornecedor}</h4>
        <h5>R$${value.preco}</h5>
    </div>
`
    $(displayName).append(tag);
}
function makeTable(tableName, value) {
    let tag = `<tr><td>${value.nome_fornecedor}</td><td>${value.produto}</td><td>${value.preco}</td></tr>`;
    $(tableName).append(tag);
}

function makeCards(cardsArea, value, x) {
    let tag = `
<div class="col-lg-4">
<div class="card mb-4 cardces" id='${value.indices.media}Card'>
    <div class="card-body">
        <div class="text-center">
                <h4 class="card-title m-0">${value.nome_produto}</h4>
                <h3 class="card-title text-center">R$${value.indices.menor_preco}</h3>
                <h6 class="card-title">${value.indices.fornecedor_menor}</h6>
                <h4 class="card-title m-0">Preço médio: R$${x}</h4>
        </div>
    </div>
</div>
</div>
`

    $(cardsArea).append(tag);
}
