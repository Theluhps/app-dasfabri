
import React from 'react';
import Layout from '@/components/Layout';
import PageLayout from '@/components/system/PageLayout';
import CustomWorkflowBuilder from '@/components/workflow/CustomWorkflowBuilder';

const WorkflowBuilder: React.FC = () => {
  return (
    <Layout>
      <PageLayout
        title="Construtor de Workflows"
        description="Crie e gerencie fluxos de trabalho personalizados para sua organização"
      >
        <div className="w-full">
          <CustomWorkflowBuilder />
        </div>
      </PageLayout>
    </Layout>
  );
};

export default WorkflowBuilder;
