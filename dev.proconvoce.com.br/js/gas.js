$(window).on('load', async () => {
    loadTableData('gas');
    btnArea();
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

async function loadTableData(query) {
    var url = `https://itajuba.myscriptcase.com/scriptcase/devel/conf/grp/Procon/libraries/php/pesquisa_total.php?id=4&qtde=3`;
        
        
    let i = 0;
    return await $.getJSON(url, (data) => {
        const vetorDeItems = [];
        const pesquisa_total = data.pesquisa_total[0];

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
        
        $.each(vetorDeItems, (key, value) => {
            if(key < 3)makeCards('#entrega', value)
            if(key >= 3 && key < 6)makeCards('#retirada', value)
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

function makeCards(cardsArea, value) {
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
                        <small>R$ ${value.diferenca_menor_maior} mais barato</small>
                    </div>
                </div>
                <div class="col-4">
                    <button type="button" class="btn btn-outline-light" 
                    data-toggle="modal" data-target="#Modal${value.id}" data-lat='10.85' data-lng='106.62'>
                        <i class="fas fa-map-marked-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
<!-- Modal -->
<div class="modal fade" id="Modal${value.id}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog  modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
      <h4 class="modal-title" id="myModalLabel">${value.nome}:</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      </div>
      <div class="modal-body">
        <div class="row">
        </div>
        <div class="row">
            <div id="map${value.id}" style="height:300px; width:100%"></div>
        </div>
        <div class="row">
          <div class="col-md-12 modal_body_end">
          <button type="button" class="btn btn-primary btn-lg btn-block">Ligar <i class="fas fa-phone"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`
    scriptString = scriptString+`
        map${value.id} = new google.maps.Map(document.getElementById("map${value.id}"), {
            center: {lat: ${value.latitude}, lng: ${value.longitude}},
            zoom: 14,
        });
        var marker = new google.maps.Marker({
            position: {lat: ${value.latitude}, lng: ${value.longitude}}, 
            map: map${value.id},
        });
    `;
    if(value.id==5){
        scriptString = scriptString+`}
        `;

        var googleMapsScript = document.createElement('script');
        scriptString = document.createTextNode(scriptString);
        googleMapsScript.appendChild(scriptString);
        document.body.appendChild(googleMapsScript);

        var my_awesome_script = document.createElement('script');
        my_awesome_script.setAttribute('src',`https://maps.googleapis.com/maps/api/js?key=AIzaSyBCnuLREFEtwCwMuLmAG3Mmre7uOXe7g40&callback=drawMap`);
        document.body.appendChild(my_awesome_script);
    }
    $(cardsArea).append(tag)
}