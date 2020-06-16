(function( $ ) {
	'use strict';

	$(function() {

		
		/**
		 *	Roda quando clica para calcular o Frete
		 */
		// $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto .calculo-de-frete div').on('click', function(e, l) {
		$(document).on('keyup', '.iptCep', function(e) {

			resetarTabela();

			if($(this).val().length === 9) {
		
				if ($(e.target).is('a#cfpp_credits')) { return; }
				
				var url = $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #calculo_frete_endpoint_url').val();
				var cep = $('.iptCep').val();
				var altura = $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #calculo_frete_produto_altura').val();
				var largura = $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #calculo_frete_produto_largura').val();
				var comprimento = $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #calculo_frete_produto_comprimento').val();
				var peso = $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #calculo_frete_produto_peso').val();
				var preco = $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #calculo_frete_produto_preco').val();
				var id_produto = $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #id_produto').val();
				
				// if (cep.length != 8) {
				// 	alert('Por favor, verifique se o CEP informado é válido.');
				// 	return false;
				// } 

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

					if (row == '') {
						
					}

					$('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto .resultado-frete table tbody').append(row);
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
							'id_produto': id_produto,
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

						$('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto .resultado-frete table tbody').append(row);
						esconderLoader();
						exibirTabela();
						inpCEP.removeAttr('disabled');
					}
				});
			}
		})

        function exibirLoader() {
            $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #calcular-frete').css('display', 'none');
            $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #calcular-frete-loader').css('display', 'inline-block');
        }

        function esconderLoader() {
            $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #calcular-frete').css('display', 'inline-block');
            $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #calcular-frete-loader').css('display', 'none');
        }

        function exibirTabela() {
            $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto .resultado-frete').show();
        }

        function esconderTabela() {
            $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto .resultado-frete').hide();
        }

        function resetarTabela() {
            $('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto .resultado-frete table tbody').html('');
        }

		$( ".single_variation_wrap" ).on( "show_variation", function ( event, variation ) {
			resetarTabela();
			esconderTabela();
			$('#woocommerce-correios-calculo-de-frete-na-pagina-do-produto #calculo_frete_produto_preco').val(variation.display_price.toFixed(2));
		} );

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
