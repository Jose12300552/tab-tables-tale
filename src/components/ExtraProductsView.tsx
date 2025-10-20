import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtraProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  available: boolean;
}

const ExtraProductsView = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ExtraProduct[]>([
    {
      id: "1",
      name: "Bebida Gaseosa",
      price: 2.5,
      description: "Refrescos variados",
      category: "Bebidas",
      available: true,
    },
    {
      id: "2",
      name: "Postre del Día",
      price: 4.0,
      description: "Postre especial de la casa",
      category: "Postres",
      available: true,
    },
    {
      id: "3",
      name: "Pan de Ajo",
      price: 3.5,
      description: "Pan artesanal con mantequilla de ajo",
      category: "Extras",
      available: true,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ExtraProduct | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const handleAdd = () => {
    const newProduct: ExtraProduct = {
      id: Date.now().toString(),
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      category: formData.category,
      available: true,
    };
    setProducts([...products, newProduct]);
    setFormData({ name: "", price: "", description: "", category: "" });
    setIsAddDialogOpen(false);
    toast({
      title: "Producto añadido",
      description: `${newProduct.name} ha sido añadido al menú.`,
    });
  };

  const handleEdit = () => {
    if (!editingProduct) return;
    setProducts(
      products.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: formData.name,
              price: Number(formData.price),
              description: formData.description,
              category: formData.category,
            }
          : product
      )
    );
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    setFormData({ name: "", price: "", description: "", category: "" });
    toast({
      title: "Producto actualizado",
      description: "El producto ha sido actualizado correctamente.",
    });
  };

  const openEditDialog = (product: ExtraProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado del menú.",
      variant: "destructive",
    });
  };

  const toggleAvailability = (id: string) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, available: !product.available } : product
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Productos Extra</h2>
          <p className="text-muted-foreground">Gestión de bebidas, postres y complementos</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Añadir Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Producto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Bebida Gaseosa"
                />
              </div>
              <div>
                <Label htmlFor="price">Precio ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Bebidas, Postres, Extras"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción del producto"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd}>Añadir Producto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card
            key={product.id}
            className={product.available ? "" : "opacity-60 border-muted"}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                </div>
                <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                  {product.category}
                </span>
                <button
                  onClick={() => toggleAvailability(product.id)}
                  className={`text-xs px-2 py-1 rounded ${
                    product.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.available ? "Disponible" : "No disponible"}
                </button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit className="h-3 w-3" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-3 w-3" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Precio ($)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Categoría</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExtraProductsView;
