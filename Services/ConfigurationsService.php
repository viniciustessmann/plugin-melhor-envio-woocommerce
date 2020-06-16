<?php

namespace Services;

use Controllers\ConfigurationController;
use Models\Address;
use Models\Agency;
use Models\CalculatorShow;
use Models\JadlogAgenciesShow;
use Models\Store;
use Models\UseInsurance;

class ConfigurationsService
{
    public function getConfigurations()
    {
        $responseAgencies = (new Agency())->getAgencies();

        return [
            'addresses'           => (new Address())->getAddressesShopping()['addresses'],
            'stores'              => (new Store())->getStories()['stores'],
            'agencies'            => $responseAgencies['agencies'],
            'allAgencies'         => $responseAgencies['allAgencies'],
            'agencySelected'      => $responseAgencies['agencySelected'],
            'calculator'          => (new CalculatorShow())->get(),
            'all_agencies_jadlog' => (new JadlogAgenciesShow())->get(),
            'use_insurance'       => (new UseInsurance())->get(),
            'where_calculator'    => (!get_option('melhor_envio_option_where_show_calculator')) ? 'woocommerce_before_add_to_cart_button' : get_option('melhor_envio_option_where_show_calculator'),
            'metodos'             => (new ConfigurationController())->getMethodsEnablesArray(),
            'services_codes'      => (new ShippingMelhorEnvioService())->getCodesEnableds(),
            'style_calculator'    => (new ConfigurationController())->getStyleArray(),
            'path_plugins'        => (new ConfigurationController())->getPathPluginsArray(),
            'options_calculator'  => (new ConfigurationController())->getOptionsCalculator()
        ];
    }
}