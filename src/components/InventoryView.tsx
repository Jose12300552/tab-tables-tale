import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRestaurant, InventoryItem } from "@/contexts/RestaurantContext";

const InventoryView = () => {
  const { toast } = useToast();
  const { inventory, updateInventory } = useRestaurant();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    minStock: "",
    category: "",
    price: "",
  });

  const handleAdd = () => {
    if (!formData.name || !formData.quantity || !formData.price) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: formData.name,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      minStock: Number(formData.minStock),
      category: formData.category,
      price: Number(formData.price),
    };
    updateInventory([...inventory, newItem]);
    setFormData({ name: "", quantity: "", unit: "", minStock: "", category: "", price: "" });
    setIsAddDialogOpen(false);
    toast({
      title: "Item añadido",
      description: `${newItem.name} ha sido añadido al inventario.`,
    });
  };

  const handleEdit = () => {
    if (!editingItem) return;
    
    if (!formData.name || !formData.quantity || !formData.price) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    updateInventory(
      inventory.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formData.name,
              quantity: Number(formData.quantity),
              unit: formData.unit,
              minStock: Number(formData.minStock),
              category: formData.category,
              price: Number(formData.price),
            }
          : item
      )
    );
    setIsEditDialogOpen(false);
    setEditingItem(null);
    setFormData({ name: "", quantity: "", unit: "", minStock: "", category: "", price: "" });
    toast({
      title: "Item actualizado",
      description: "El item ha sido actualizado correctamente.",
    });
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity.toString(),
      unit: item.unit,
      minStock: item.minStock.toString(),
      category: item.category,
      price: item.price.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    updateInventory(inventory.filter((item) => item.id !== id));
    toast({
      title: "Item eliminado",
      description: "El item ha sido eliminado del inventario.",
      variant: "destructive",
    });
  };

  const lowStockItems = inventory.filter((item) => item.quantity <= item.minStock);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Inventario</h2>
          <p className="text-muted-foreground">Gestión de productos e insumos</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Añadir Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Hamburguesa"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Cantidad *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unidad</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="kg, L, unidades"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minStock">Stock Mínimo</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Precio ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Comida, Bebidas, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd}>Añadir Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Package className="h-5 w-5" />
              Alerta de Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {lowStockItems.length} item(s) con stock bajo o agotado:{" "}
              {lowStockItems.map((item) => item.name).join(", ")}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock Mínimo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.minStock}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {item.quantity <= item.minStock ? (
                      <span className="text-destructive font-semibold">Bajo</span>
                    ) : (
                      <span className="text-green-600">Normal</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-quantity">Cantidad *</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-unit">Unidad</Label>
                <Input
                  id="edit-unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-minStock">Stock Mínimo</Label>
                <Input
                  id="edit-minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Precio ($) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-category">Categoría</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

export default InventoryView;