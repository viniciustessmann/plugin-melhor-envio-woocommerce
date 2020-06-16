(function( $ ) {
	'use strict';

	$(function() {
		
		$('#melhor-envio-shortcode form').submit(function(e) {
			e.preventDefault();
			resetarTabela();

			if ($(e.target).is('a#cfpp_credits')) { return; }
			
			var cep = $('.iptCepShortcode').val();
			
			var altura = $('#calculo_frete_produto_altura').val();
			var largura = $('#calculo_frete_produto_largura').val();
			var comprimento = $('#calculo_frete_produto_comprimento').val();
			var peso = $('#calculo_frete_produto_peso').val();
			var preco = $('#calculo_frete_produto_preco').val();
			var url = $('#calculo_frete_url').val();

			var errors = [];

			if  (altura == 0) {
				errors.push('Produto com altura não informada');
			}

			if  (largura == 0) {
				errors.push('Produto com largura não informada');
			}

			if  (comprimento == 0) {
				errors.push('Produto com comprimento não informada');
			}

			if  (peso == 0) {
				errors.push('Produto com peso não informado');
			}

			if(errors.length > 0) {

				var row = '';
				row = '<tr><td colspan="3">Ocorreu um erro ao obter informações sobre o valor do frete</td></tr>';

				errors.map( item => {
					row += `<tr><td colspan="3">${item}</td></tr>`;
				});

				$('#melhor-envio-shortcode .resultado-frete table tbody').append(row);
				esconderLoader();
				exibirTabela();

				return false;
			}

			let inpCEP = $(this);
			inpCEP.attr('disabled','disabled');

			exibirLoader();
			esconderTabela();
			resetarTabela();

			let qty = 1;
			let inpQty = $('.quantity .qty:visible').val(); 
			if (typeof inpQty != 'undefined') {
				qty = inpQty;
			}

			$.ajax({
				url: url,
				type:"POST",
				data: {
					'action' : 'cotation_product_page',
					'data' : {
						'cep_origem': cep,
						'produto_altura': altura,
						'produto_largura': largura,
						'produto_comprimento': comprimento,
						'produto_peso': peso,
						'produto_preco': preco,
						'quantity': qty
					}
				},
				error:function(jqXHR, exception) {
					var msg = '';
					if (jqXHR.status === 0) {
						msg = 'Not connect.\n Verify Network.';
					} else if (jqXHR.status == 404) {
						msg = 'Requested page not found. [404]';
					} else if (jqXHR.status == 500) {
						msg = 'Internal Server Error [500].';
					} else if (exception === 'parsererror') {
						msg = 'Requested JSON parse failed.';
					} else if (exception === 'timeout') {
						msg = 'Time out error.';
					} else if (exception === 'abort') {
						msg = 'Ajax request aborted.';
					} else {
						msg = 'Uncaught Error.\n' + jqXHR.responseText;
					}
					inpCEP.removeAttr('disabled');
					esconderLoader();
					esconderTabela();
					resetarTabela();
					return false;
				},
				success:function(result) {
					let response = JSON.parse(result);
					if (!response.success || response.erro) {
						inpCEP.removeAttr('disabled');
						alert(response.message);
						esconderLoader();
						esconderTabela();
						resetarTabela();
						return false;
					}
					
					var row = '';
					let { data } = response;
					data.map( item => {
						let name = item.name.split('(');
						name = name[0];
						
						row += `<tr><td>${item.company + ' ' + name}</td><td>${item.price}</td><td>${item.delivery_time}</td></tr>`;
					});

					if (row == '') {
						row = '<tr><td colspan="3">Desculpe, o cálculo de frete para este produto só está disponível no Carrinho, por favor, prossiga com a compra normalmente.</td></tr>';
					}

					$('#melhor-envio-shortcode .resultado-frete table tbody').append(row);
					esconderLoader();
					exibirTabela();
					inpCEP.removeAttr('disabled');
				}
			});
		})

        function exibirLoader() {
            $('#melhor-envio-shortcode #calcular-frete').css('display', 'none');
            $('#melhor-envio-shortcode #calcular-frete-loader').css('display', 'inline-block');
        }

        function esconderLoader() {
            $('#melhor-envio-shortcode #calcular-frete').css('display', 'inline-block');
            $('#melhor-envio-shortcode #calcular-frete-loader').css('display', 'none');
        }

        function exibirTabela() {
            $('#melhor-envio-shortcode .resultado-frete').show();
        }

        function esconderTabela() {
            $('#melhor-envio-shortcode .resultado-frete').hide();
        }

        function resetarTabela() {
            $('#melhor-envio-shortcode .resultado-frete table tbody').html('');
        }

	});
})( jQuery );

function validateNumber(event) {

	console.log(event);

    var key = window.event ? event.keyCode : event.which;
    if (event.keyCode === 8 || event.keyCode === 46) {
        return true;
    } else if ( key < 48 || key > 57 ) {
        return false;
    } else {
        return true;
    }
};
