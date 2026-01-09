
import { WorkflowDefinition } from '@/types/workflow';

export const workflowDefinitions: WorkflowDefinition[] = [
  {
    id: 'purchase-order-flow',
    name: 'Fluxo de Pedido de Compra',
    description: 'Workflow para criação e aprovação de pedidos de compra',
    initialStepId: 'po-creation',
    steps: [
      {
        id: 'po-creation',
        name: 'Criação do Pedido',
        description: 'Criação do pedido de compra com detalhes de produtos e fornecedores',
        requiredRole: 'comprador',
        nextStepId: 'po-approval'
      },
      {
        id: 'po-approval',
        name: 'Aprovação do Pedido',
        description: 'Aprovação do pedido pelo gerente de compras',
        requiredRole: 'gerente_compras',
        previousStepId: 'po-creation',
        nextStepId: 'po-send'
      },
      {
        id: 'po-send',
        name: 'Envio ao Fornecedor',
        description: 'Envio do pedido aprovado ao fornecedor',
        requiredRole: 'comprador',
        previousStepId: 'po-approval'
      }
    ]
  },
  {
    id: 'documents-validation-flow',
    name: 'Fluxo de Validação de Documentos',
    description: 'Workflow para validação e processamento de documentos de importação',
    initialStepId: 'doc-receive',
    steps: [
      {
        id: 'doc-receive',
        name: 'Recebimento de Documentos',
        description: 'Recebimento e cadastro inicial de documentos',
        requiredRole: 'administrativo_importacao',
        nextStepId: 'doc-validation'
      },
      {
        id: 'doc-validation',
        name: 'Validação de Documentos',
        description: 'Validação regulatória de documentos',
        requiredRole: 'analista_importacao',
        previousStepId: 'doc-receive',
        nextStepId: 'doc-customs'
      },
      {
        id: 'doc-customs',
        name: 'Liberação para Despacho',
        description: 'Liberação de documentos para o despacho aduaneiro',
        requiredRole: 'despachante_aduaneiro',
        previousStepId: 'doc-validation'
      }
    ]
  },
  {
    id: 'customs-release-flow',
    name: 'Fluxo de Liberação Aduaneira',
    description: 'Workflow para gestão de despacho e liberação aduaneira',
    initialStepId: 'customs-process',
    steps: [
      {
        id: 'customs-process',
        name: 'Processamento Aduaneiro',
        description: 'Encaminhamento para processamento na Receita Federal',
        requiredRole: 'despachante_aduaneiro',
        nextStepId: 'customs-validation'
      },
      {
        id: 'customs-validation',
        name: 'Validação de Despacho',
        description: 'Validação do despacho pelo analista de importação',
        requiredRole: 'analista_importacao',
        previousStepId: 'customs-process',
        nextStepId: 'logistics-release'
      },
      {
        id: 'logistics-release',
        name: 'Liberação para Logística',
        description: 'Liberação da carga para transporte interno',
        requiredRole: 'coordenador_logistico',
        previousStepId: 'customs-validation'
      }
    ]
  },
  {
    id: 'payment-flow',
    name: 'Fluxo de Pagamentos',
    description: 'Workflow para aprovação e execução de pagamentos',
    initialStepId: 'payment-request',
    steps: [
      {
        id: 'payment-request',
        name: 'Solicitação de Pagamento',
        description: 'Solicitação de pagamento ao fornecedor',
        requiredRole: 'financeiro',
        nextStepId: 'payment-approval'
      },
      {
        id: 'payment-approval',
        name: 'Aprovação de Pagamento',
        description: 'Aprovação do pagamento pelo gerente financeiro',
        requiredRole: 'gerente_financeiro',
        previousStepId: 'payment-request',
        nextStepId: 'payment-execution'
      },
      {
        id: 'payment-execution',
        name: 'Execução do Pagamento',
        description: 'Execução da transação financeira',
        requiredRole: 'financeiro',
        previousStepId: 'payment-approval'
      }
    ]
  },
  {
    id: 'cargo-reception-flow',
    name: 'Fluxo de Recebimento de Carga',
    description: 'Workflow para confirmação de entrada e armazenagem',
    initialStepId: 'cargo-arrival',
    steps: [
      {
        id: 'cargo-arrival',
        name: 'Chegada da Carga',
        description: 'Confirmação da chegada física da carga',
        requiredRole: 'operador_armazem',
        nextStepId: 'cargo-inspection'
      },
      {
        id: 'cargo-inspection',
        name: 'Inspeção da Carga',
        description: 'Inspeção detalhada da carga recebida',
        requiredRole: 'coordenador_logistico',
        previousStepId: 'cargo-arrival',
        nextStepId: 'cargo-storage'
      },
      {
        id: 'cargo-storage',
        name: 'Armazenamento da Carga',
        description: 'Confirmação do armazenamento apropriado',
        requiredRole: 'operador_armazem',
        previousStepId: 'cargo-inspection'
      }
    ]
  }
];
