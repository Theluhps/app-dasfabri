
import { useNotifications } from '@/contexts/NotificationsContext';
import { useNotificationSound } from '@/hooks/use-notification-sound';

export const useWorkflowNotifications = () => {
  const { addNotification } = useNotifications();
  const { playNotificationSound } = useNotificationSound();

  const notifyApprovalCreated = (processId: string) => {
    addNotification({
      title: 'Nova solicitação criada',
      message: `Uma solicitação de aprovação foi criada para o processo ${processId}.`,
      type: 'info',
      category: 'workflow'
    });
    playNotificationSound();
  };

  const notifyApprovalAccepted = (processId: string) => {
    addNotification({
      title: 'Solicitação aprovada',
      message: `A solicitação para o processo ${processId} foi aprovada.`,
      type: 'success',
      category: 'workflow'
    });
    playNotificationSound();
  };

  const notifyApprovalRejected = (processId: string) => {
    addNotification({
      title: 'Solicitação rejeitada',
      message: `A solicitação para o processo ${processId} foi rejeitada.`,
      type: 'alert',
      category: 'workflow'
    });
    playNotificationSound();
  };

  const notifyWorkflowCompleted = (processId: string) => {
    addNotification({
      title: 'Workflow concluído',
      message: `O workflow para o processo ${processId} foi concluído com sucesso.`,
      type: 'success',
      category: 'workflow'
    });
    playNotificationSound();
  };

  return {
    notifyApprovalCreated,
    notifyApprovalAccepted,
    notifyApprovalRejected,
    notifyWorkflowCompleted
  };
};
