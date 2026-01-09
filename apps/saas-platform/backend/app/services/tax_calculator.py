"""
Serviço de cálculos tributários para importação
Implementa fórmulas brasileiras de impostos de importação
"""

from typing import Dict, Optional, List
from decimal import Decimal
from datetime import date
from loguru import logger


class TaxCalculator:
    """
    Calculadora de tributos de importação brasileiros
    """
    
    # Alíquotas padrão (podem ser configuráveis)
    DEFAULT_II_RATE = Decimal('0.15')  # 15% Imposto de Importação
    DEFAULT_IPI_RATE = Decimal('0.10')  # 10% IPI
    DEFAULT_PIS_RATE = Decimal('0.0165')  # 1.65% PIS
    DEFAULT_COFINS_RATE = Decimal('0.076')  # 7.6% COFINS
    DEFAULT_ICMS_RATE = Decimal('0.18')  # 18% ICMS (varia por estado)
    
    def __init__(self):
        self.ii_rate = self.DEFAULT_II_RATE
        self.ipi_rate = self.DEFAULT_IPI_RATE
        self.pis_rate = self.DEFAULT_PIS_RATE
        self.cofins_rate = self.DEFAULT_COFINS_RATE
        self.icms_rate = self.DEFAULT_ICMS_RATE
    
    def calculate_import_taxes(
        self,
        cif_value: Decimal,
        freight: Decimal = Decimal('0'),
        insurance: Decimal = Decimal('0'),
        ncm_code: Optional[str] = None,
        origin_country: Optional[str] = None,
        destination_state: Optional[str] = None,
        custom_rates: Optional[Dict[str, Decimal]] = None
    ) -> Dict[str, any]:
        """
        Calcula todos os tributos de importação
        
        Args:
            cif_value: Valor CIF (Cost, Insurance, Freight) em USD
            freight: Valor do frete em USD
            insurance: Valor do seguro em USD
            ncm_code: Código NCM (Nomenclatura Comum do Mercosul)
            origin_country: País de origem
            destination_state: Estado de destino (para ICMS)
            custom_rates: Taxas customizadas (opcional)
        
        Returns:
            Dict com todos os cálculos tributários
        """
        # Usar taxas customizadas se fornecidas
        rates = custom_rates or {}
        ii_rate = rates.get('II', self.ii_rate)
        ipi_rate = rates.get('IPI', self.ipi_rate)
        pis_rate = rates.get('PIS', self.pis_rate)
        cofins_rate = rates.get('COFINS', self.cofins_rate)
        icms_rate = rates.get('ICMS', self.icms_rate)
        
        # Valor total CIF
        total_cif = cif_value + freight + insurance
        
        # 1. Imposto de Importação (II)
        # Base: Valor CIF
        ii_base = total_cif
        ii_amount = ii_base * ii_rate
        
        # 2. IPI (Imposto sobre Produtos Industrializados)
        # Base: Valor CIF + II
        ipi_base = total_cif + ii_amount
        ipi_amount = ipi_base * ipi_rate
        
        # 3. PIS (Programa de Integração Social)
        # Base: Valor CIF + II + IPI
        pis_base = total_cif + ii_amount + ipi_amount
        pis_amount = pis_base * pis_rate
        
        # 4. COFINS (Contribuição para o Financiamento da Seguridade Social)
        # Base: Valor CIF + II + IPI
        cofins_base = total_cif + ii_amount + ipi_amount
        cofins_amount = cofins_base * cofins_rate
        
        # 5. ICMS (Imposto sobre Circulação de Mercadorias e Serviços)
        # Base: Valor CIF + II + IPI + PIS + COFINS + Taxa Siscomex + outras despesas
        # Simplificado: CIF + II + IPI + PIS + COFINS
        icms_base = total_cif + ii_amount + ipi_amount + pis_amount + cofins_amount
        # Fórmula ICMS: (Base / (1 - Alíquota)) - Base
        icms_amount = (icms_base / (Decimal('1') - icms_rate)) - icms_base
        
        # Total de impostos
        total_taxes = ii_amount + ipi_amount + pis_amount + cofins_amount + icms_amount
        
        # Valor total a pagar
        total_amount = total_cif + total_taxes
        
        result = {
            'cif_value': float(cif_value),
            'freight': float(freight),
            'insurance': float(insurance),
            'total_cif': float(total_cif),
            'taxes': {
                'II': {
                    'rate': float(ii_rate),
                    'base': float(ii_base),
                    'amount': float(ii_amount)
                },
                'IPI': {
                    'rate': float(ipi_rate),
                    'base': float(ipi_base),
                    'amount': float(ipi_amount)
                },
                'PIS': {
                    'rate': float(pis_rate),
                    'base': float(pis_base),
                    'amount': float(pis_amount)
                },
                'COFINS': {
                    'rate': float(cofins_rate),
                    'base': float(cofins_base),
                    'amount': float(cofins_amount)
                },
                'ICMS': {
                    'rate': float(icms_rate),
                    'base': float(icms_base),
                    'amount': float(icms_amount)
                }
            },
            'total_taxes': float(total_taxes),
            'total_amount': float(total_amount),
            'tax_percentage': float((total_taxes / total_cif) * 100) if total_cif > 0 else 0,
            'ncm_code': ncm_code,
            'origin_country': origin_country,
            'destination_state': destination_state
        }
        
        logger.info(f"Cálculo tributário: CIF={total_cif}, Total Impostos={total_taxes}, Total={total_amount}")
        
        return result
    
    def calculate_simple_tax(
        self,
        base_value: Decimal,
        tax_rate: Decimal,
        tax_name: str = "Tax"
    ) -> Dict[str, float]:
        """
        Calcula um imposto simples
        
        Args:
            base_value: Valor base
            tax_rate: Alíquota (ex: 0.15 para 15%)
            tax_name: Nome do imposto
        
        Returns:
            Dict com base, rate e amount
        """
        amount = base_value * tax_rate
        
        return {
            'name': tax_name,
            'base': float(base_value),
            'rate': float(tax_rate),
            'amount': float(amount)
        }
    
    def get_ncm_rate(self, ncm_code: str) -> Optional[Decimal]:
        """
        Obtém alíquota de II baseada no código NCM
        TODO: Integrar com tabela de NCM real
        
        Args:
            ncm_code: Código NCM (8 dígitos)
        
        Returns:
            Alíquota de II ou None se não encontrado
        """
        # Exemplos de alíquotas por NCM (implementação simplificada)
        ncm_rates = {
            '8471': Decimal('0.16'),  # Computadores
            '8517': Decimal('0.14'),  # Telefones
            '8703': Decimal('0.35'),  # Automóveis
        }
        
        # Pegar primeiros 4 dígitos
        ncm_prefix = ncm_code[:4] if ncm_code else None
        
        return ncm_rates.get(ncm_prefix, self.DEFAULT_II_RATE)
    
    def estimate_total_cost(
        self,
        product_value: Decimal,
        exchange_rate: Decimal,
        freight: Decimal = Decimal('0'),
        insurance: Decimal = Decimal('0'),
        ncm_code: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Estima custo total de importação incluindo todos os impostos
        
        Args:
            product_value: Valor do produto em moeda estrangeira
            exchange_rate: Taxa de câmbio
            freight: Frete em moeda estrangeira
            insurance: Seguro em moeda estrangeira
            ncm_code: Código NCM
        
        Returns:
            Dict com estimativa completa
        """
        # Converter para BRL
        cif_usd = product_value + freight + insurance
        cif_brl = cif_usd * exchange_rate
        
        # Obter alíquota de II baseada no NCM
        ii_rate = self.get_ncm_rate(ncm_code) if ncm_code else self.ii_rate
        
        # Calcular impostos
        taxes = self.calculate_import_taxes(
            cif_value=cif_brl,
            freight=Decimal('0'),  # Já incluído no CIF
            insurance=Decimal('0'),  # Já incluído no CIF
            ncm_code=ncm_code,
            custom_rates={'II': ii_rate}
        )
        
        return {
            'product_value_usd': float(product_value),
            'freight_usd': float(freight),
            'insurance_usd': float(insurance),
            'cif_usd': float(cif_usd),
            'exchange_rate': float(exchange_rate),
            'cif_brl': float(cif_brl),
            'taxes_brl': taxes['total_taxes'],
            'total_cost_brl': taxes['total_amount'],
            'breakdown': taxes
        }


# Singleton do serviço
_tax_calculator: Optional[TaxCalculator] = None


def get_tax_calculator() -> TaxCalculator:
    """Obtém instância singleton do TaxCalculator"""
    global _tax_calculator
    if _tax_calculator is None:
        _tax_calculator = TaxCalculator()
    return _tax_calculator

