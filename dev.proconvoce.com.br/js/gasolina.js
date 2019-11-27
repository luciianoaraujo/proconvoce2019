$(window).on('load', async () => {
    loadTableData('comb');
    btnArea();
})
$('#escolha').on('click', (e) => {
    $('#escolhaInfo').toggleClass('hide');
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
    var url = `https://itajuba.myscriptcase.com/scriptcase/devel/conf/grp/Procon/libraries/php/pesquisa_total.php?id=3&qtde=5`;
    let i = 0;
    let qtd_cards = 0;
    let gasolina = [];
    let diesel = [];
    let etanol = [];
    let a;
    const vetorDeItems = [];
    
    return await $.getJSON(url, (data) => {
        
        const pesquisa_total = data.pesquisa_total[0];
        console.log(pesquisa_total)
        
        pesquisa_total.pesquisas.forEach(pesquisa => {
            let dataPesquisa = pesquisa.data_publicacao;
            pesquisa.items.forEach(item => {
                let itemLocal = new Item();
                if (item.produto_id == 13 || item.produto_id == 16 || item.produto_id == 17 || item.produto_id == 7 || item.produto_id == 129 || item.produto_id == 15 || item.produto_id == 8 || item.produto_id == 130 || item.produto_id == 14) {
                    itemLocal.nome = item.nome_produto;
                    itemLocal.fornecedor = item.indices['fornecedor_menor'];
                    itemLocal.preco = item.indices['menor_preco'];
                    itemLocal.data = dataPesquisa;
                    itemLocal.diferenca_menor_maior = item.indices['diferenca_menor_maior'];
                    itemLocal.idp = item.produto_id;
                    vetorDeItems.push(itemLocal);
                }
            });
        });
        console.log(vetorDeItems)
        $.each(vetorDeItems, function (key, value) {
            if (value.nome === 'Diesel') {
                diesel.push(value);
                makeTable('#tabelaDiesel', value);
                i = 3;
                qtd_cards++;
            } else
                if (value.nome == 'Etanol') {
                    etanol.push(value);
                    makeTable('#tabelaEtanol', value);
                    i = 6;
                    qtd_cards++;
                } else
                    if (value.nome == 'Gasolina') {
                        gasolina.push(value);
                        makeTable('#tabelaGasolina', value);
                        i = 0;
                        qtd_cards++;
                    } else
                    if (i == 2) {
                        gasolina.push(value);
                        makeTable('#tabelaGasolina', value);
                        i = 0;
                        qtd_cards++;
                    }
            if (qtd_cards <= 3){
                if(value.idp == 13 || value.idp == 16 || value.idp == 17){
                    makeCards('#cardsAreaDiesel', value);
                }
                if(value.idp == 8 || value.idp == 130 || value.idp == 14){
                    makeCards('#cardsAreaGasolina', value);
                }
                if(value.idp == 7 || value.idp == 129 || value.idp == 15){
                    makeCards('#cardsAreaEtanol', value);
                }
            }
        });
        
        makeCharts(diesel, gasolina, etanol);
        selecionarCombustivel('#escolha',gasolina[0], etanol[0]);
        $('#preloader').fadeOut(500, function () { $(this).remove(); });
        $('.menu').removeClass('hiden');
    })
}
function makeTable(tableName, value) {
    let tag = `<tr><td>${value.fornecedor}</td><td>${value.data}</td><td>${value.preco}</td></tr>`;
    $(tableName).append(tag);
}

function makeCards(cardsArea, value) {
    value.nome = value.nome.replace('Aditivado', 'Adt.');
    value.nome = value.nome.replace('Aditivada', 'Adt.');
    if (value.nome.length > 22) {
        value.nome = value.nome.split(" ")[0] + `*`;
    }
    let tag = `
<div class="card2">
<div class="card mb-4 cardcom" id='${value.nome}Card'>
    <div class="card-body">
        <div class="d-flex justify-content-between align-items-top">
            <div class="card-name">
                <h4 class="card-title">${value.nome}</h4>
            </div>
            <div class="preco text-center">
                <h3 class="card-title text-center">R$${value.preco}</h3>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-8">
                    <div>
                        <h6 class="card-title">${value.fornecedor}</h6>
                        <small style>R$ ${value.diferenca_menor_maior} mais barato</small>
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
    scriptString = scriptString + `
        map${value.id} = new google.maps.Map(document.getElementById("map${value.id}"), {
            center: {lat: ${value.latitude}, lng: ${value.longitude}},
            zoom: 14,
        });
        var marker = new google.maps.Marker({
            position: {lat: ${value.latitude}, lng: ${value.longitude}}, 
            map: map${value.id},
        });
    `;
    if (value.id == 8) {
        scriptString = scriptString + `}
        `;

        var googleMapsScript = document.createElement('script');
        scriptString = document.createTextNode(scriptString);
        googleMapsScript.appendChild(scriptString);
        document.body.appendChild(googleMapsScript);

        var my_awesome_script = document.createElement('script');
        my_awesome_script.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=AIzaSyBCnuLREFEtwCwMuLmAG3Mmre7uOXe7g40&callback=drawMap`);
        document.body.appendChild(my_awesome_script);
    }
    $(cardsArea).append(tag)
}


async function makeCharts(diesel, gasolina, etanol) {
    let chartD = {}
    chartD.data = [];
    chartD.preco = [];
    let chartG = {}
    chartG.data = [];
    chartG.preco = [];
    let chartE = {}
    chartE.data = [];
    chartE.preco = [];

    diesel.forEach(e => {
        chartD.data.push(e.data);
        e.preco = e.preco.replace(",", ".");
        e.data = e.data.replace('\\d{4}', '');
        chartD.preco.push(parseFloat(e.preco));
    });
    chartD.data.reverse()
    chartD.preco.reverse()
    gasolina.forEach(e => {
        chartG.data.push(e.data);
        e.preco = e.preco.replace(",", ".");
        chartG.preco.push(parseFloat(e.preco));
    });
    chartG.data.reverse()
    chartG.preco.reverse()
    etanol.forEach(e => {
        chartE.data.push(e.data);
        e.preco = e.preco.replace(",", ".");
        chartE.preco.push(parseFloat(e.preco));
    });
    chartE.data.reverse()
    chartE.preco.reverse()

    var gas = document.getElementById('chartGas').getContext('2d');
    var eta = document.getElementById('chartEta').getContext('2d');
    var die = document.getElementById('chartDie').getContext('2d');

    var myChart = new Chart(die, {
        type: 'line',
        data: {
            labels: chartD.data,
            datasets: [{
                label: 'Diesel',
                data: chartD.preco,
                backgroundColor: 'rgba(36, 124, 198, 0.85)',
            }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        stepSize: 0.5
                    }
                }]
            }
        }
    });
    var myChart = new Chart(eta, {
        type: 'line',
        data: {
            labels: chartE.data,
            datasets: [{
                label: 'Etanol',
                data: chartE.preco,
                backgroundColor: 'rgba(36, 124, 198, 0.85)',
            }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        stepSize: 0.5
                    }
                }]
            }
        }
    });
    var myChart = new Chart(gas, {
        type: 'line',
        data: {
            labels: chartG.data,
            datasets: [{
                label: 'Gasolina',
                data: chartG.preco,
                backgroundColor: 'rgba(36, 124, 198, 0.85)',
            }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        stepSize: 0.5
                    }
                }]
            }
        }
    });
}

function selecionarCombustivel(escolha, gasolina, etanol) {
    let porcentagem = parseFloat(etanol.preco) / parseFloat(gasolina.preco);
    let tag;
    if (porcentagem < 0.7) {
        tag = `
        <i class="fas fa-chevron-down"></i> Qual vale mais a pena? <b style="
        color: rgb(255, 196, 0);
    ">ETANOL ${porcentagem.toFixed(2) * 100}%</b> em relação a gasolina.
        `;
        $(`#${etanol.nome}Card`).addClass('menor-preco');
    } else {
        tag = `
        <i class="fas fa-chevron-down"></i> Qual vale mais a pena? <b style="
        color: rgb(255, 196, 0);
    ">Gasolina no posto: ${gasolina.fornecedor}</b>
        `;
        $(`#${gasolina.nome}Card`).addClass('menor-preco');
    }
    $(escolha).append(tag);
}


// scroll dos cards
var clicked = false, base = 0;

$('#cardsArea').on({
    mousemove: function (e) {
        clicked && function (xAxis) {
            var _this = $(this);
            if (base > xAxis) {
                base = xAxis;
                _this.css('margin-left', '-=30px');
            }
            if (base < xAxis) {
                base = xAxis;
                _this.css('margin-left', '+=30px');
            }
        }.call($(this), e.pageX);
    },
    mousedown: function (e) {
        clicked = true;
        base = e.pageX;
    },
    mouseup: function (e) {
        clicked = false;
        base = 0;
    }
});
