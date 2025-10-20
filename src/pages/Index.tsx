import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, ClipboardList, Utensils, Package, ShoppingCart } from "lucide-react";
import KitchenView from "@/components/KitchenView";
import OrdersView from "@/components/OrdersView";
import TablesView from "@/components/TablesView";
import InventoryView from "@/components/InventoryView";
import ExtraProductsView from "@/components/ExtraProductsView";

const Index = () => {
  const [activeTab, setActiveTab] = useState("kitchen");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <ChefHat className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Kitchen Flow</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestión de Restaurante</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-4xl grid-cols-5 mb-6">
            <TabsTrigger value="kitchen" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              <span className="hidden sm:inline">Cocina</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="tables" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              <span className="hidden sm:inline">Mesas</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventario</span>
            </TabsTrigger>
            <TabsTrigger value="extras" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Extras</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kitchen" className="mt-0">
            <KitchenView />
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <OrdersView />
          </TabsContent>

          <TabsContent value="tables" className="mt-0">
            <TablesView />
          </TabsContent>

          <TabsContent value="inventory" className="mt-0">
            <InventoryView />
          </TabsContent>

          <TabsContent value="extras" className="mt-0">
            <ExtraProductsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
