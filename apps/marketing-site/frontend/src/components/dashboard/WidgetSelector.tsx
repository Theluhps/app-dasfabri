import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Settings, Loader2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dashboardConfigService, WidgetConfig, AvailableWidget } from '@/services/dashboardConfigService';

interface WidgetSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigUpdated?: () => void;
}

const WidgetSelector: React.FC<WidgetSelectorProps> = ({
  open,
  onOpenChange,
  onConfigUpdated
}) => {
  const { toast } = useToast();
  const [availableWidgets, setAvailableWidgets] = useState<AvailableWidget[]>([]);
  const [enabledWidgets, setEnabledWidgets] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      loadConfig();
    }
  }, [open]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const [available, config] = await Promise.all([
        dashboardConfigService.getAvailableWidgets(),
        dashboardConfigService.getConfig()
      ]);

      setAvailableWidgets(available.widgets);
      
      // Extrair widgets habilitados da configuração
      const enabled = new Set(
        config.widgets_config.widgets
          .filter((w: WidgetConfig) => w.enabled)
          .map((w: WidgetConfig) => w.id)
      );
      setEnabledWidgets(enabled);
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a configuração do dashboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWidget = (widgetId: string) => {
    setEnabledWidgets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(widgetId)) {
        newSet.delete(widgetId);
      } else {
        newSet.add(widgetId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Criar array de widgets com posições
      const widgets: WidgetConfig[] = availableWidgets.map((widget, index) => ({
        id: widget.id,
        enabled: enabledWidgets.has(widget.id),
        position: enabledWidgets.has(widget.id) ? index : undefined,
      }));

      await dashboardConfigService.updateConfig({
        widgets_config: { widgets },
      });

      toast({
        title: 'Sucesso',
        description: 'Configuração do dashboard salva com sucesso',
      });

      if (onConfigUpdated) {
        onConfigUpdated();
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a configuração',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Tem certeza que deseja resetar a configuração para o padrão?')) {
      return;
    }

    try {
      setSaving(true);
      await dashboardConfigService.resetConfig();
      await loadConfig();
      toast({
        title: 'Sucesso',
        description: 'Configuração resetada para o padrão',
      });
    } catch (error) {
      console.error('Erro ao resetar configuração:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível resetar a configuração',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurar Widgets do Dashboard
          </DialogTitle>
          <DialogDescription>
            Selecione quais widgets você deseja exibir no seu dashboard
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#7E69AB]" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableWidgets.map((widget) => (
                <div
                  key={widget.id}
                  className={`p-4 border rounded-lg flex items-start gap-3 ${
                    enabledWidgets.has(widget.id)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Checkbox
                    id={widget.id}
                    checked={enabledWidgets.has(widget.id)}
                    onCheckedChange={() => handleToggleWidget(widget.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={widget.id}
                      className="font-medium cursor-pointer"
                    >
                      {widget.name}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {widget.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {enabledWidgets.size === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p>Selecione pelo menos um widget para exibir no dashboard</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={loading || saving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || saving || enabledWidgets.size === 0}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetSelector;

