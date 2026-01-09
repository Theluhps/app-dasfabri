import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package, Search, Edit, Trash2, Sparkles, Upload, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { productsService, Product, ProductCreate, ProductUpdate, ProductCategory } from '@/services/productsService';
import CSVUploadDialog from '@/components/csv/CSVUploadDialog';

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };
      const data = await productsService.listProducts(params);
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productsService.listCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search/filter change
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja desativar este produto?')) return;

    try {
      await productsService.deleteProduct(id);
      toast({
        title: 'Sucesso',
        description: 'Produto desativado com sucesso',
      });
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível desativar o produto',
        variant: 'destructive',
      });
    }
  };

  const handleClassify = async (id: number) => {
    try {
      await productsService.classifyProduct(id);
      toast({
        title: 'Sucesso',
        description: 'Produto classificado automaticamente',
      });
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível classificar o produto',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (data: ProductCreate | ProductUpdate) => {
    try {
      if (editingProduct) {
        await productsService.updateProduct(editingProduct.id, data as ProductUpdate);
        toast({
          title: 'Sucesso',
          description: 'Produto atualizado com sucesso',
        });
      } else {
        await productsService.createProduct(data as ProductCreate);
        toast({
          title: 'Sucesso',
          description: 'Produto criado com sucesso',
        });
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Erro',
        description: editingProduct ? 'Não foi possível atualizar o produto' : 'Não foi possível criar o produto',
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
                <Package className="h-5 w-5" />
                Catálogo de Produtos
              </CardTitle>
              <CardDescription>
                Gerencie seu catálogo de produtos e categorias
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCSVUpload(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Importar CSV
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {products.length} produto(s) encontrado(s)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Página {currentPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={products.length < itemsPerPage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>NCM</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      Nenhum produto encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono">{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.ncm || '-'}</TableCell>
                      <TableCell>{product.category || '-'}</TableCell>
                      <TableCell>
                        {product.unit_price
                          ? `${product.currency} ${product.unit_price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                          {product.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {product.ncm_confidence && (
                          <Badge variant="outline" className="ml-2">
                            {product.ncm_confidence.toFixed(0)}% confiança
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!product.ncm && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleClassify(product.id)}
                              title="Classificar automaticamente"
                            >
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ProductFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        product={editingProduct}
        categories={categories}
        onSubmit={handleSubmit}
      />

      <CSVUploadDialog
        open={showCSVUpload}
        onOpenChange={setShowCSVUpload}
        onSuccess={() => {
          fetchProducts();
          setShowCSVUpload(false);
        }}
        type="products"
      />
    </div>
  );
};

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: ProductCategory[];
  onSubmit: (data: ProductCreate | ProductUpdate) => void;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ProductCreate>({
    code: '',
    name: '',
    description: '',
    ncm: '',
    origin_country: '',
    weight: undefined,
    unit: '',
    category: '',
    unit_price: undefined,
    currency: 'USD',
    supplier_id: undefined,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code,
        name: product.name,
        description: product.description || '',
        ncm: product.ncm || '',
        origin_country: product.origin_country || '',
        weight: product.weight,
        unit: product.unit || '',
        category: product.category || '',
        unit_price: product.unit_price,
        currency: product.currency,
        supplier_id: product.supplier_id,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        ncm: '',
        origin_country: '',
        weight: undefined,
        unit: '',
        category: '',
        unit_price: undefined,
        currency: 'USD',
        supplier_id: undefined,
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogDescription>
            {product ? 'Atualize as informações do produto' : 'Adicione um novo produto ao catálogo'}
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
                disabled={!!product}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ncm">NCM</Label>
              <Input
                id="ncm"
                value={formData.ncm}
                onChange={(e) => setFormData({ ...formData, ncm: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="unit_price">Preço Unitário</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price || ''}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value ? parseFloat(e.target.value) : undefined })}
              />
            </div>
            <div>
              <Label htmlFor="currency">Moeda</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="BRL">BRL</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
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

export default ProductsManagement;

