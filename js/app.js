class Despesa {

    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano,
        this.mes = mes,
        this.dia = dia,
        this.tipo = tipo,
        this.descricao = descricao,
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}

class Db {

    constructor() {
        let id = localStorage.getItem('id');

        if(id === null) { 
            localStorage.setItem('id', 0);
        }

    }

    getProximoID() {
        let proximoID = localStorage.getItem('id');
        return parseInt(proximoID) + 1;
    }
    

    gravarDespesa(despesa) {

        let id = this.getProximoID();

        localStorage.setItem(id, JSON.stringify(despesa))
        localStorage.setItem('id', id);
        
    }

    recuperarTodosRegistros() {

        let despesas = Array();

        let id = localStorage.getItem('id');

        for(let i = 1; i <= id; i++) {

            let despesa = JSON.parse(localStorage.getItem(i));
            
           //Se existe alguma despesa que foi removida, pulando ele.
           if(despesa === null) {
               continue;
           }
           despesa.id = i;
           despesas.push(despesa);
        }
        return despesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros();

            if(despesa.ano != '') {
                despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
            }
            if(despesa.mes != '') {
                despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
            }
            if(despesa.dia != '') {
                despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
            }
            if(despesa.tipo != '') {
                despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
            }
            if(despesa.descricao != '') {
                despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
            }
            if(despesa.valor != '') {
                despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
            }
        return despesasFiltradas;
    }
    remover(id) {
        localStorage.removeItem(id)
    }

}

let db = new Db();

function cadastrarDespesa() {

    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let novaDespesa = new Despesa(
        ano.value, 
        mes.value,
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
        );

    if(novaDespesa.validarDados()) {

        db.gravarDespesa(novaDespesa);
        
        mostrarModal(1); // 1 para Modal de Sucesso. || 0 para Modal de Erro. // 

        /* Zerando os Campos */
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else {
        mostrarModal(0);
    }
    
    /* Encapsulando a função de Mostrar Modal dentro de outra função para corrigir a falha de ser chamada sem necessidade. */
    function mostrarModal(x) {

        let tituloModal = document.getElementById('registraDespesaLabel');
        let conteudoModal = document.getElementById('modalcontent');
        let botaoModal = document.getElementById('botaomodal');
        
        switch(x) {
        case 0:
            
            tituloModal.innerText = 'Expense registration error!';
            tituloModal.setAttribute('class', 'text-danger');
            botaoModal.setAttribute('class', 'btn btn-danger');
        
            conteudoModal.innerHTML = 'It was not possible to register your expense<br><br><b>Please fill all the filds correctly.</b>';
            $('#registraDespesa').modal('show')
        break;
        
        case 1:
            tituloModal.innerText = 'Expense has been registrated.', 
            tituloModal.setAttribute('class', 'text-success');
            botaoModal.setAttribute('class', 'btn btn-success')
        
            conteudoModal.innerHTML = 'Your expense has been <b>registrated.</b><br><br>You can consult now.';
            $('#registraDespesa').modal('show')
        break;
        }
    }
}

function carregarListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
		despesas = db.recuperarTodosRegistros() 
	}

	let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''
	despesas.forEach(function(d){

		//Criando a linha (tr)
		var linha = listaDespesas.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.mes}/${d.dia}/${d.ano}` 

		//Ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimentation'
				break
			case '2': d.tipo = 'Education'
				break
			case '3': d.tipo = 'Leisure'
				break
			case '4': d.tipo = 'Health'
				break
			case '5': d.tipo = 'Transport'
				break
			
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = '$' + d.valor

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function() {
            let id = this.id.replace('id_despesa_', '');
            db.remover(id);

            /* Mostrar Modal quando Remover */
            let tituloModal = document.getElementById('registraDespesaLabel');
            let conteudoModal = document.getElementById('modalcontent');
            let botaoModal = document.getElementById('botaomodal');
            
            tituloModal.innerText = 'Expense successfully removed', 
            tituloModal.setAttribute('class', 'text-warning');
            botaoModal.setAttribute('class', 'btn btn-warning text-white')
        
            conteudoModal.innerHTML = 'Your expense <b>is successfully removed.</b>';
            $('#registraDespesa').modal('show')
        }
        linha.insertCell(4).append(btn)
	})

 }

function pesquisarDespesa(){
	 
	let ano  = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = db.pesquisar(despesa)
	 
	this.carregarListaDespesas(despesas, true)

 }

String.prototype.reverse = function(){
    return this.split('').reverse().join(''); 
};

 function mascaraMoeda(campo, evento){
    var tecla = (!evento) ? window.event.keyCode : evento.which;
    var valor  =  campo.value.replace(/[^\d]+/gi,'').reverse();
    var resultado  = "";
    var mascara = "##.###.###,##".reverse();
    for (var x=0, y=0; x<mascara.length && y<valor.length;) {
      if (mascara.charAt(x) != '#') {
        resultado += mascara.charAt(x);
        x++;
      } else {
        resultado += valor.charAt(y);
        y++;
        x++;
      }
    }
    campo.value = resultado.reverse();
  }
