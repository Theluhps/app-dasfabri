
import React, { useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Mail,
  Smartphone,
  Clock,
  Users,
  FileText,
  Package,
  AlertTriangle
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { toast } from '@/hooks/use-toast';

const NotificationSettings = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Notification channels
  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    push: false,
    sms: false
  });

  // Notification types
  const [notificationTypes, setNotificationTypes] = useState({
    process: true,
    document: true,
    license: true,
    deadline: true,
    system: true
  });

  // Priority settings
  const [prioritySettings, setPrioritySettings] = useState({
    low: {
      inApp: true,
      email: false,
      push: false,
      sms: false
    },
    medium: {
      inApp: true,
      email: true,
      push: false,
      sms: false
    },
    high: {
      inApp: true,
      email: true,
      push: true,
      sms: false
    },
    critical: {
      inApp: true,
      email: true,
      push: true,
      sms: true
    }
  });

  // Update channel settings
  const handleChannelChange = (channel: keyof typeof channels) => {
    setChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  // Update notification type settings
  const handleTypeChange = (type: keyof typeof notificationTypes) => {
    setNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Update priority channel settings
  const handlePriorityChannelChange = (
    priority: keyof typeof prioritySettings,
    channel: keyof typeof prioritySettings.low
  ) => {
    setPrioritySettings(prev => ({
      ...prev,
      [priority]: {
        ...prev[priority],
        [channel]: !prev[priority][channel]
      }
    }));
  };

  // Save settings
  const handleSave = () => {
    // Here you would typically save to backend or local storage
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de notificação foram atualizadas com sucesso."
    });
  };

  return (
    <PageLayout
      title="Configurações de Notificações"
      description="Gerencie suas preferências de notificações"
    >
      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="channels">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="channels">Canais</TabsTrigger>
            <TabsTrigger value="types">Tipos</TabsTrigger>
            <TabsTrigger value="priority">Prioridades</TabsTrigger>
          </TabsList>
          
          {/* Channels Tab */}
          <TabsContent value="channels">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-gray-100' : ''}>
                  Canais de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label htmlFor="in-app" className={isDark ? 'text-gray-200' : ''}>
                          Notificações no App
                        </Label>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Receba notificações dentro do sistema
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="in-app"
                      checked={channels.inApp}
                      onCheckedChange={() => handleChannelChange('inApp')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label htmlFor="email" className={isDark ? 'text-gray-200' : ''}>
                          E-mail
                        </Label>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Receba notificações por e-mail
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="email"
                      checked={channels.email}
                      onCheckedChange={() => handleChannelChange('email')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Smartphone className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label htmlFor="push" className={isDark ? 'text-gray-200' : ''}>
                          Push
                        </Label>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Receba notificações push no seu dispositivo
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="push"
                      checked={channels.push}
                      onCheckedChange={() => handleChannelChange('push')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Smartphone className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label htmlFor="sms" className={isDark ? 'text-gray-200' : ''}>
                          SMS
                        </Label>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Receba notificações via SMS
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="sms"
                      checked={channels.sms}
                      onCheckedChange={() => handleChannelChange('sms')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Types Tab */}
          <TabsContent value="types">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-gray-100' : ''}>
                  Tipos de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Package className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label htmlFor="process" className={isDark ? 'text-gray-200' : ''}>
                          Processos
                        </Label>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Atualizações sobre processos
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="process"
                      checked={notificationTypes.process}
                      onCheckedChange={() => handleTypeChange('process')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label htmlFor="document" className={isDark ? 'text-gray-200' : ''}>
                          Documentos
                        </Label>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Atualizações sobre documentos
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="document"
                      checked={notificationTypes.document}
                      onCheckedChange={() => handleTypeChange('document')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label htmlFor="license" className={isDark ? 'text-gray-200' : ''}>
                          Licenças
                        </Label>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Atualizações sobre licenças
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="license"
                      checked={notificationTypes.license}
                      onCheckedChange={() => handleTypeChange('license')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label htmlFor="deadline" className={isDark ? 'text-gray-200' : ''}>
                          Prazos
                        </Label>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Notificações sobre prazos
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="deadline"
                      checked={notificationTypes.deadline}
                      onCheckedChange={() => handleTypeChange('deadline')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label htmlFor="system" className={isDark ? 'text-gray-200' : ''}>
                          Sistema
                        </Label>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Notificações do sistema
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="system"
                      checked={notificationTypes.system}
                      onCheckedChange={() => handleTypeChange('system')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Priorities Tab */}
          <TabsContent value="priority">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-gray-100' : ''}>
                  Configuração de Prioridades
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Low Priority */}
                <div className="mb-6">
                  <h3 className={`text-md font-medium mb-3 ${isDark ? 'text-gray-200' : ''}`}>
                    Baixa Prioridade
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="low-in-app"
                        checked={prioritySettings.low.inApp}
                        onCheckedChange={() => handlePriorityChannelChange('low', 'inApp')}
                      />
                      <Label htmlFor="low-in-app" className={isDark ? 'text-gray-300' : ''}>
                        No App
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="low-email"
                        checked={prioritySettings.low.email}
                        onCheckedChange={() => handlePriorityChannelChange('low', 'email')}
                      />
                      <Label htmlFor="low-email" className={isDark ? 'text-gray-300' : ''}>
                        E-mail
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="low-push"
                        checked={prioritySettings.low.push}
                        onCheckedChange={() => handlePriorityChannelChange('low', 'push')}
                      />
                      <Label htmlFor="low-push" className={isDark ? 'text-gray-300' : ''}>
                        Push
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="low-sms"
                        checked={prioritySettings.low.sms}
                        onCheckedChange={() => handlePriorityChannelChange('low', 'sms')}
                      />
                      <Label htmlFor="low-sms" className={isDark ? 'text-gray-300' : ''}>
                        SMS
                      </Label>
                    </div>
                  </div>
                </div>
                
                {/* Medium Priority */}
                <div className="mb-6">
                  <h3 className={`text-md font-medium mb-3 ${isDark ? 'text-gray-200' : ''}`}>
                    Média Prioridade
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="medium-in-app"
                        checked={prioritySettings.medium.inApp}
                        onCheckedChange={() => handlePriorityChannelChange('medium', 'inApp')}
                      />
                      <Label htmlFor="medium-in-app" className={isDark ? 'text-gray-300' : ''}>
                        No App
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="medium-email"
                        checked={prioritySettings.medium.email}
                        onCheckedChange={() => handlePriorityChannelChange('medium', 'email')}
                      />
                      <Label htmlFor="medium-email" className={isDark ? 'text-gray-300' : ''}>
                        E-mail
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="medium-push"
                        checked={prioritySettings.medium.push}
                        onCheckedChange={() => handlePriorityChannelChange('medium', 'push')}
                      />
                      <Label htmlFor="medium-push" className={isDark ? 'text-gray-300' : ''}>
                        Push
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="medium-sms"
                        checked={prioritySettings.medium.sms}
                        onCheckedChange={() => handlePriorityChannelChange('medium', 'sms')}
                      />
                      <Label htmlFor="medium-sms" className={isDark ? 'text-gray-300' : ''}>
                        SMS
                      </Label>
                    </div>
                  </div>
                </div>
                
                {/* High Priority */}
                <div className="mb-6">
                  <h3 className={`text-md font-medium mb-3 ${isDark ? 'text-gray-200' : ''}`}>
                    Alta Prioridade
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="high-in-app"
                        checked={prioritySettings.high.inApp}
                        onCheckedChange={() => handlePriorityChannelChange('high', 'inApp')}
                      />
                      <Label htmlFor="high-in-app" className={isDark ? 'text-gray-300' : ''}>
                        No App
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="high-email"
                        checked={prioritySettings.high.email}
                        onCheckedChange={() => handlePriorityChannelChange('high', 'email')}
                      />
                      <Label htmlFor="high-email" className={isDark ? 'text-gray-300' : ''}>
                        E-mail
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="high-push"
                        checked={prioritySettings.high.push}
                        onCheckedChange={() => handlePriorityChannelChange('high', 'push')}
                      />
                      <Label htmlFor="high-push" className={isDark ? 'text-gray-300' : ''}>
                        Push
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="high-sms"
                        checked={prioritySettings.high.sms}
                        onCheckedChange={() => handlePriorityChannelChange('high', 'sms')}
                      />
                      <Label htmlFor="high-sms" className={isDark ? 'text-gray-300' : ''}>
                        SMS
                      </Label>
                    </div>
                  </div>
                </div>
                
                {/* Critical Priority */}
                <div className="mb-6">
                  <h3 className={`text-md font-medium mb-3 ${isDark ? 'text-gray-200' : ''}`}>
                    Prioridade Crítica
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="critical-in-app"
                        checked={prioritySettings.critical.inApp}
                        onCheckedChange={() => handlePriorityChannelChange('critical', 'inApp')}
                      />
                      <Label htmlFor="critical-in-app" className={isDark ? 'text-gray-300' : ''}>
                        No App
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="critical-email"
                        checked={prioritySettings.critical.email}
                        onCheckedChange={() => handlePriorityChannelChange('critical', 'email')}
                      />
                      <Label htmlFor="critical-email" className={isDark ? 'text-gray-300' : ''}>
                        E-mail
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="critical-push"
                        checked={prioritySettings.critical.push}
                        onCheckedChange={() => handlePriorityChannelChange('critical', 'push')}
                      />
                      <Label htmlFor="critical-push" className={isDark ? 'text-gray-300' : ''}>
                        Push
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="critical-sms"
                        checked={prioritySettings.critical.sms}
                        onCheckedChange={() => handlePriorityChannelChange('critical', 'sms')}
                      />
                      <Label htmlFor="critical-sms" className={isDark ? 'text-gray-300' : ''}>
                        SMS
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotificationSettings;
