import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Warehouse as WarehouseIcon, Package, ArrowRight, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { warehousesService, Warehouse, WarehouseCreate, WarehouseUpdate, InventoryItem, StockMovement } from '@/services/warehousesService';

const WarehouseManagement: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const { toast } = useToast();

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await warehousesService.listWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error('Erro ao carregar armazéns:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os armazéns',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async (warehouseId: number) => {
    try {
      const data = await warehousesService.getInventory(warehouseId);
      setInventory(data);
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
    }
  };

  const fetchMovements = async (warehouseId: number) => {
    try {
      const data = await warehousesService.getMovements(warehouseId);
      setMovements(data);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (selectedWarehouse) {
      fetchInventory(selectedWarehouse.id);
      fetchMovements(selectedWarehouse.id);
    }
  }, [selectedWarehouse]);

  const handleCreate = () => {
    setEditingWarehouse(null);
    setShowForm(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setShowForm(true);
  };

  const handleSelect = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
  };

  const handleSubmit = async (data: WarehouseCreate | WarehouseUpdate) => {
    try {
      if (editingWarehouse) {
        await warehousesService.updateWarehouse(editingWarehouse.id, data as WarehouseUpdate);
        toast({
          title: 'Sucesso',
          description: 'Armazém atualizado com sucesso',
        });
      } else {
        await warehousesService.createWarehouse(data as WarehouseCreate);
        toast({
          title: 'Sucesso',
          description: 'Armazém criado com sucesso',
        });
      }
      setShowForm(false);
      setEditingWarehouse(null);
      fetchWarehouses();
    } catch (error) {
      toast({
        title: 'Erro',
        description: editingWarehouse ? 'Não foi possível atualizar o armazém' : 'Não foi possível criar o armazém',
        variant: 'destructive',
      });
    }
  };

  const handleAddInventory = async (data: InventoryItemCreate) => {
    if (!selectedWarehouse) return;
    
    try {
      await warehousesService.addInventoryItem(selectedWarehouse.id, data);
      toast({
        title: 'Sucesso',
        description: 'Item adicionado ao inventário',
      });
      setShowInventoryForm(false);
      fetchInventory(selectedWarehouse.id);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o item',
        variant: 'destructive',
      });
    }
  };

  const handleCreateMovement = async (data: StockMovementCreate) => {
    if (!selectedWarehouse) return;
    
    try {
      await warehousesService.createMovement(selectedWarehouse.id, data);
      toast({
        title: 'Sucesso',
        description: 'Movimentação registrada',
      });
      setShowMovementForm(false);
      fetchMovements(selectedWarehouse.id);
      fetchInventory(selectedWarehouse.id);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a movimentação',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <WarehouseIcon className="h-5 w-5" />
                Gestão de Armazéns
              </CardTitle>
              <CardDescription>
                Gerencie seus armazéns, inventário e movimentações de estoque
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Armazém
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warehouses.map((warehouse) => (
                <Card
                  key={warehouse.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedWarehouse?.id === warehouse.id ? 'border-primary' : ''
                  }`}
                  onClick={() => handleSelect(warehouse)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                        <CardDescription className="font-mono text-xs">{warehouse.code}</CardDescription>
                      </div>
                      <Badge variant={warehouse.status === 'active' ? 'default' : 'secondary'}>
                        {warehouse.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {warehouse.address && (
                        <p className="text-sm text-gray-600">{warehouse.address}</p>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Capacidade:</span>
                        <span className="font-semibold">
                          {warehouse.used_capacity.toLocaleString('pt-BR')} /{' '}
                          {warehouse.total_capacity?.toLocaleString('pt-BR') || '∞'}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(warehouse);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedWarehouse && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Armazém: {selectedWarehouse.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="inventory">
              <TabsList>
                <TabsTrigger value="inventory">Inventário</TabsTrigger>
                <TabsTrigger value="movements">Movimentações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inventory" className="mt-4">
                <div className="flex justify-end mb-4">
                  <Button onClick={() => setShowInventoryForm(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          Nenhum item no inventário
                        </TableCell>
                      </TableRow>
                    ) : (
                      inventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>#{item.product_id || '-'}</TableCell>
                          <TableCell>{item.quantity.toLocaleString('pt-BR')}</TableCell>
                          <TableCell>{item.unit || '-'}</TableCell>
                          <TableCell>{item.location || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={item.is_available ? 'default' : 'secondary'}>
                              {item.is_available ? 'Disponível' : 'Reservado'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="movements" className="mt-4">
                <div className="flex justify-end mb-4">
                  <Button onClick={() => setShowMovementForm(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Movimentação
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Referência</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                          Nenhuma movimentação registrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      movements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell>
                            <Badge variant="outline">
                              {movement.movement_type === 'entry' && <ArrowRight className="h-3 w-3 mr-1" />}
                              {movement.movement_type === 'exit' && <ArrowLeft className="h-3 w-3 mr-1" />}
                              {movement.movement_type}
                            </Badge>
                          </TableCell>
                          <TableCell>{movement.quantity.toLocaleString('pt-BR')}</TableCell>
                          <TableCell>{new Date(movement.movement_date).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{movement.reference_number || '-'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <WarehouseFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        warehouse={editingWarehouse}
        onSubmit={handleSubmit}
      />

      {selectedWarehouse && (
        <>
          <InventoryItemDialog
            open={showInventoryForm}
            onOpenChange={setShowInventoryForm}
            warehouseId={selectedWarehouse.id}
            onSubmit={handleAddInventory}
          />
          <StockMovementDialog
            open={showMovementForm}
            onOpenChange={setShowMovementForm}
            warehouseId={selectedWarehouse.id}
            inventoryItems={inventory}
            onSubmit={handleCreateMovement}
          />
        </>
      )}
    </div>
  );
};

interface WarehouseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse: Warehouse | null;
  onSubmit: (data: WarehouseCreate | WarehouseUpdate) => void;
}

const WarehouseFormDialog: React.FC<WarehouseFormDialogProps> = ({
  open,
  onOpenChange,
  warehouse,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<WarehouseCreate>({
    code: '',
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: 'Brasil',
    postal_code: '',
    total_capacity: undefined,
  });

  useEffect(() => {
    if (warehouse) {
      setFormData({
        code: warehouse.code,
        name: warehouse.name,
        description: warehouse.description || '',
        address: warehouse.address || '',
        city: warehouse.city || '',
        state: warehouse.state || '',
        country: warehouse.country || 'Brasil',
        postal_code: '',
        total_capacity: warehouse.total_capacity,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        address: '',
        city: '',
        state: '',
        country: 'Brasil',
        postal_code: '',
        total_capacity: undefined,
      });
    }
  }, [warehouse, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{warehouse ? 'Editar Armazém' : 'Novo Armazém'}</DialogTitle>
          <DialogDescription>
            {warehouse ? 'Atualize as informações do armazém' : 'Adicione um novo armazém'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                disabled={!!warehouse}
              />
            </div>
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="postal_code">CEP</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="total_capacity">Capacidade Total</Label>
            <Input
              id="total_capacity"
              type="number"
              value={formData.total_capacity || ''}
              onChange={(e) => setFormData({ ...formData, total_capacity: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface InventoryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouseId: number;
  onSubmit: (data: InventoryItemCreate) => void;
}

const InventoryItemDialog: React.FC<InventoryItemDialogProps> = ({
  open,
  onOpenChange,
  warehouseId,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<InventoryItemCreate>({
    product_id: undefined,
    quantity: 0,
    unit: '',
    location: '',
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        product_id: undefined,
        quantity: 0,
        unit: '',
        location: '',
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Item ao Inventário</DialogTitle>
          <DialogDescription>
            Adicione um novo item ao inventário do armazém
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product_id">ID do Produto</Label>
            <Input
              id="product_id"
              type="number"
              value={formData.product_id || ''}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value ? parseInt(e.target.value) : undefined })}
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <Label htmlFor="unit">Unidade</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="kg, un, m²..."
            />
          </div>
          <div>
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ex: Prateleira A-12"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface StockMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouseId: number;
  inventoryItems: InventoryItem[];
  onSubmit: (data: StockMovementCreate) => void;
}

const StockMovementDialog: React.FC<StockMovementDialogProps> = ({
  open,
  onOpenChange,
  warehouseId,
  inventoryItems,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<StockMovementCreate>({
    movement_type: 'entry',
    quantity: 0,
    unit: '',
    reference_number: '',
    notes: '',
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        movement_type: 'entry',
        quantity: 0,
        unit: '',
        reference_number: '',
        notes: '',
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Movimentação de Estoque</DialogTitle>
          <DialogDescription>
            Registre uma nova movimentação de estoque
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="movement_type">Tipo de Movimentação *</Label>
            <Select
              value={formData.movement_type}
              onValueChange={(value: 'entry' | 'exit' | 'transfer' | 'adjustment') =>
                setFormData({ ...formData, movement_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entrada</SelectItem>
                <SelectItem value="exit">Saída</SelectItem>
                <SelectItem value="transfer">Transferência</SelectItem>
                <SelectItem value="adjustment">Ajuste</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="inventory_item_id">Item do Inventário</Label>
            <Select
              value={formData.inventory_item_id?.toString() || ''}
              onValueChange={(value) =>
                setFormData({ ...formData, inventory_item_id: value ? parseInt(value) : undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um item" />
              </SelectTrigger>
              <SelectContent>
                {inventoryItems.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    Item #{item.id} - {item.quantity} {item.unit || 'un'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <Label htmlFor="unit">Unidade</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="kg, un, m²..."
            />
          </div>
          <div>
            <Label htmlFor="reference_number">Número de Referência</Label>
            <Input
              id="reference_number"
              value={formData.reference_number}
              onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
              placeholder="Ex: PO-2024-001"
            />
          </div>
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseManagement;

