
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

const AddCompanyDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Nova Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Adicionar Empresa</DialogTitle>
          <DialogDescription>
            Preencha as informações da nova empresa.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            <TabsTrigger value="additional">Dados Adicionais</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Nome da empresa"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cnpj" className="text-right">
                CNPJ
              </Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Endereço
              </Label>
              <Input
                id="address"
                placeholder="Endereço completo"
                className="col-span-3"
              />
            </div>
          </TabsContent>
          <TabsContent value="additional" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo
              </Label>
              <Input
                id="type"
                placeholder="Cliente, Fornecedor, Parceiro"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="segment" className="text-right">
                Segmento
              </Label>
              <Input
                id="segment"
                placeholder="Segmento de atuação"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contato
              </Label>
              <Input
                id="contact"
                placeholder="Nome do contato principal"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                placeholder="email@empresa.com"
                className="col-span-3"
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type="submit">Adicionar Empresa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyDialog;
