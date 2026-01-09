
import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Palette, Sun, Moon, Contrast } from 'lucide-react';

const Theme = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <PageLayout 
      title="Configurações de Tema" 
      description="Personalize a aparência do sistema de acordo com suas preferências"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Configure o tema e outras preferências visuais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="theme">Tema</TabsTrigger>
                <TabsTrigger value="preferences">Preferências Visuais</TabsTrigger>
              </TabsList>
              
              <TabsContent value="theme" className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme-switch" className="text-base">Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                      {theme === 'dark' ? 
                        'A interface está usando o tema escuro.' : 
                        'A interface está usando o tema claro.'}
                    </p>
                  </div>
                  <Switch 
                    id="theme-switch" 
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>
                
                <div className="pt-4">
                  <Label className="text-base pb-2 block">Selecione um tema</Label>
                  <RadioGroup defaultValue={theme} className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <RadioGroupItem 
                        value="light" 
                        id="theme-light" 
                        className="peer sr-only" 
                        checked={theme === 'light'}
                        onClick={() => theme === 'dark' && toggleTheme()}
                      />
                      <Label 
                        htmlFor="theme-light" 
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-dasfabri-blue [&:has([data-state=checked])]:border-dasfabri-blue"
                      >
                        <Sun className="h-6 w-6 mb-3" />
                        <div className="space-y-1 text-center">
                          <p className="font-medium leading-none">Claro</p>
                          <p className="text-sm text-muted-foreground">
                            Interface com fundo claro
                          </p>
                        </div>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="dark" 
                        id="theme-dark" 
                        className="peer sr-only"
                        checked={theme === 'dark'}
                        onClick={() => theme === 'light' && toggleTheme()}
                      />
                      <Label 
                        htmlFor="theme-dark" 
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-dasfabri-blue [&:has([data-state=checked])]:border-dasfabri-blue dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <Moon className="h-6 w-6 mb-3" />
                        <div className="space-y-1 text-center">
                          <p className="font-medium leading-none">Escuro</p>
                          <p className="text-sm text-muted-foreground">
                            Interface com fundo escuro
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="contrast" className="text-base">Alto contraste</Label>
                      <p className="text-sm text-muted-foreground">
                        Aumenta o contraste da interface para melhor visualização
                      </p>
                    </div>
                    <Switch id="contrast" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="animations" className="text-base">Animações</Label>
                      <p className="text-sm text-muted-foreground">
                        Ativa ou desativa as animações da interface
                      </p>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact" className="text-base">Modo compacto</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduz o espaçamento entre os elementos
                      </p>
                    </div>
                    <Switch id="compact" />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Label className="text-base mb-2 block">Tamanho de fonte</Label>
                  <RadioGroup defaultValue="normal" className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <RadioGroupItem value="small" id="font-small" className="peer sr-only" />
                      <Label 
                        htmlFor="font-small" 
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-dasfabri-blue [&:has([data-state=checked])]:border-dasfabri-blue dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <span className="text-sm">Aa</span>
                        <p className="text-sm text-muted-foreground pt-2">Pequena</p>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="normal" id="font-normal" className="peer sr-only" />
                      <Label 
                        htmlFor="font-normal" 
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-dasfabri-blue [&:has([data-state=checked])]:border-dasfabri-blue dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <span className="text-base">Aa</span>
                        <p className="text-sm text-muted-foreground pt-2">Normal</p>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="large" id="font-large" className="peer sr-only" />
                      <Label 
                        htmlFor="font-large" 
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-dasfabri-blue [&:has([data-state=checked])]:border-dasfabri-blue dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <span className="text-lg">Aa</span>
                        <p className="text-sm text-muted-foreground pt-2">Grande</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Theme;
