import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, ClipboardList, Utensils, Package, CalendarDays, BarChart3 } from "lucide-react";
import KitchenView from "@/components/KitchenView";
import OrdersView from "@/components/OrdersView";
import TablesView from "@/components/TablesView";
import InventoryView from "@/components/InventoryView";
import ReservationsView from "@/components/ReservationsView";
import ReportsView from "@/components/ReportsView";

const Index = () => {
  const [activeTab, setActiveTab] = useState("kitchen");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                <img src="/src/assets/quinta-estacion-logo.png.png" alt="Quinta Estación" className="h-12 w-12 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Quinta Estación</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestión de Restaurante</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-5xl grid-cols-6 mb-6">
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
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Reservas</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Reportes</span>
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

          <TabsContent value="reservations" className="mt-0">
            <ReservationsView />
          </TabsContent>

          <TabsContent value="reports" className="mt-0">
            <ReportsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;