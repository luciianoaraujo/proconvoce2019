$(window).on('load', async () => {
    loadTableData('gas');
})
let scriptString = `
function drawMap() {    
    var mapOptions = {
      zoom: 13,
     }
 `;
class Item {
    constructor(nome, preco, fornecedor, dataPesquisa) {
        this.nome = nome;
        this.preco = preco;
        this.fornecedor = fornecedor;
        this.data = dataPesquisa;
    }
}

async function AddCords(fornecedorId) {
    let url = `https://api.proconvoce.com.br/api/fornecedor_detalhe.php?procon_id=1&id=${fornecedorId}`;
    let coords = []
    await $.getJSON(url, (data) => {
        coords[0] = data.fornecedor_detalhe.latitude;
        coords[1] = data.fornecedor_detalhe.longitude;
    })
    return coords;
}

async function loadTableData(query) {
    var url = `https://itajuba.myscriptcase.com/scriptcase/devel/conf/grp/Procon/libraries/php/pesquisa_total.php?id=4&qtde=2`;


    let i = 0;
    return await $.getJSON(url, (data) => {
        const vetorDeItems = [];
        const pesquisa_total = data.pesquisa_total[0];

        pesquisa_total.pesquisas.forEach(pesquisa => {
            let dataPesquisa = pesquisa.data_publicacao;
            pesquisa.items.forEach(item => {
                let itemLocal = new Item();
                itemLocal.idp = item['produto_id'];
                itemLocal.fornecedorId = item.indices['fornecedor_menor_id'];
                itemLocal.nome = item.nome_produto;
                itemLocal.fornecedor = item.indices['fornecedor_menor'];
                itemLocal.preco = item.indices['menor_preco'];
                itemLocal.data = dataPesquisa;
                itemLocal.diferenca_menor_maior = item.indices['diferenca_menor_maior'];
                vetorDeItems.push(itemLocal);

            });
        });

        $.each(vetorDeItems, (key, value) => {
            if (key < 3) makeCards('#entrega', value)
            if (key >= 3 && key < 6) makeCards('#retirada', value)
            makeTable('#tableArea', value);
            $('#preloader').remove();
            $('.menu').removeClass('hiden');
        });
    })
}
function makeTable(tableName, value) {
    let tag = `<tr><td>${value.fornecedor}</td><td>${value.nome}</td><td>${value.preco}</td><td>${value.data}</td></tr>`;
    $(tableName).append(tag);
}


async function abrirModal(fornecedor, fornecedorID) {
    let coords = await AddCords(fornecedorID)
    let lat = `${coords[0]}`;
    let lon = `${coords[1]}`;

    if (lon.length > 6) {
        lon = lon.substring(0, (lon.length - 1));
    }

    console.log(coords)
    let tag = `
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h7 class="modal-title">${fornecedor}</h7>
                <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
            <iframe src="https://maps.google.com/maps?q=+${lat}+,+${lon}+&hl=en&z=14&amp;output=embed" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen></iframe>
            </div>
            </div>
        </div>
    `;
    $('#modal').html(tag);
    $('#modal').modal('show')
}


async function makeCards(cardsArea, value) {
    let coords = await AddCords(value.fornecedorId)
    const lat = `${coords[0]}`;
    const lon = `${coords[1]}`;
    console.log(lat);
    console.log(lon);

    value.nome = value.nome.replace('Entrega - ', '');
    value.nome = value.nome.replace('Retirada - ', '');
    value.nome = value.nome.replace('Cartão/', '');


    let tag = `
<div class="col-lg-4">
<div class="card mb-4 cardgas" id='${value.nome}Card'>
    <div class="card-body">
        <div class="d-flex justify-content-between align-items-top">
            <div class="card-name">
                <h4 class="card-title">${value.nome}</h4>
            </div>
            <div class="preco text-center">
                <h3 class="card-title text-center"> R$${value.preco}</h3>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-8">
                    <div>
                        <h6 class="card-title">${value.fornecedor}</h6>
                    </div>
                </div>
                <div class="col-4">
                <button type="button" class="btn btn-outline-light" 
             onclick="abrirModal('${value.fornecedor}','${value.fornecedorId}')">
                    <i class="fas fa-map-marked-alt"></i>
                </button>
            </div>
            </div>
        </div>
        <small>R$ ${value.diferenca_menor_maior} mais barato</small>
    </div>
</div>
</div>
`
    $(cardsArea).append(tag)
}