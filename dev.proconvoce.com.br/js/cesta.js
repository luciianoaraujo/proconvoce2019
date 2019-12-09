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
    var url = `https://api.proconvoce.com.br/api/pesquisa_total.php?procon_id=1&id=2&qtde=1`;
    
    let i = 0;
    return await $.getJSON(url, (data) => {
        const cesta = {}
        
        const pesquisa_total = data.pesquisa_total[0];
        
        pesquisa_total.pesquisas.forEach(pesquisa => {
        
            cesta.data = pesquisa.data_publicacao;
            cesta.cesta_barata = pesquisa['cesta_barata'];
            cesta.ranking_cesta = pesquisa['ranking_cesta'];
            cesta.itens = pesquisa["items"];
            
        });
        
        $.each(cesta.ranking_cesta, function (key, value) {
            if(key < 3){
                makeDisplay('#displayRanking', value);
            }
        });
        
        $.each(cesta.itens, function (aux_key, aux_value) {
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
    let tag = `<tr><td>${value.nome_fornecedor} ${value.unidade}</td><td>${value.produto}</td><td>${value.preco}</td></tr>`;
    $(tableName).append(tag);
}

async function carregar_dados(produto_id){
    var url = `https://api.proconvoce.com.br/api/pesquisa_total.php?procon_id=1&id=2&qtde=1`;
    return await $.getJSON(url, (data) => {
        const pesquisa_total = data.pesquisa_total[0];
        
        pesquisa_total.pesquisas.forEach(pesquisa =>{
            pesquisa.items.forEach(element => {
                if(element.produto_id == produto_id){
                    console.log(element.ranking);
                    element.ranking.forEach(element => {
                        makeTablecesta('#tabelacesta', element.nome_fornecedor, element.marca, element.preco);
                    });
                };
            });
        });
    });
}

function makeTablecesta(tableName, nome_fornecedor, marca, preco) {
    let tag = `<tr><td>${nome_fornecedor}</td><td>${marca}</td><td>${preco}</td></tr>`;
    $(tableName).append(tag);
}

async function abrirModal(nome_produto, unidade, produto_id){
    carregar_dados(produto_id);
    let tag = `
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h7 class="modal-title">${nome_produto} ${unidade}</h7>
            <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
            <div class="modal-body">
                <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                <table class="table">
                <thead>
                    <th><i class="fas fa-dolly"></i> Fornecedor</th>
                    <th><i class="far fa-calendar-alt"></i> Marca</th>
                    <th><i class="fas fa-dollar-sign"></i> Preço</th>
                </thead>
                <tbody id='tabelacesta'>
                </tbody>
                </table>
            </div>
        </div>
        </div>
    </div>
`;

$('#modalcesta').html(tag);
$('#modalcesta').modal()
} 

function makeCards(cardsArea, value, x) {
    let tag = `
<div class="col-lg-4" onclick="abrirModal('${value.nome_produto}','${value.unidade}','${value.produto_id}')">
<div class="card mb-4 cardces" id='${value.indices.media}Card'>
    <div class="card-body">
        <div class="text-center">
                <h4 class="card-title m-0">${value.nome_produto}</h4>
                <h4 class="card-title m-0">${value.unidade}</h4>
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
