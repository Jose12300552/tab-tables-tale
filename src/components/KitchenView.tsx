import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, ChefHat, CheckCircle2, DollarSign } from "lucide-react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const KitchenView = () => {
  const { tableOrders, updateKitchenItemStatus } = useRestaurant();
  const { toast } = useToast();

  // Obtener todas las comandas activas
  const activeOrders = Object.values(tableOrders);

  // Obtener todos los items de comida para las estadísticas
  const allKitchenItems = activeOrders.flatMap(order => 
    order.items.filter(item => item.category === "Comida")
  );

  const handleStartPreparing = (tableId: string, itemId: string) => {
    updateKitchenItemStatus(tableId, itemId, "preparing");
    toast({
      title: "Preparación iniciada",
      description: "El plato está siendo preparado",
    });
  };

  const handleMarkReady = (tableId: string, itemId: string, itemName: string, tableNumber: number) => {
    updateKitchenItemStatus(tableId, itemId, "ready");
    toast({
      title: "Plato listo",
      description: `${itemName} para Mesa ${tableNumber} está listo para servir`,
    });
  };

  const getKitchenItemStatus = (item: any) => {
    if (item.category !== "Comida") return null;
    return item.kitchenStatus || "pending";
  };

  const stats = {
    pending: allKitchenItems.filter(item => item.kitchenStatus === "pending").length,
    preparing: allKitchenItems.filter(item => item.kitchenStatus === "preparing").length,
    ready: allKitchenItems.filter(item => item.kitchenStatus === "ready").length,
    totalOrders: activeOrders.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Cocina</h2>
          <p className="text-muted-foreground">Comandas activas por mesa</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Comandas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">En Preparación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.preparing}</div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Listos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.ready}</div>
          </CardContent>
        </Card>
      </div>

      {/* Comandas Agrupadas por Mesa */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Comandas Activas
        </h3>

        {activeOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ChefHat className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg">No hay comandas activas</p>
              <p className="text-sm">Las comandas de las mesas aparecerán aquí</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeOrders.map((order) => {
              const foodItems = order.items.filter(item => item.category === "Comida");
              const timeElapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
              
              // Si no tiene items de comida, no mostrar esta comanda
              if (foodItems.length === 0) return null;

              return (
                <Card 
                  key={order.tableId} 
                  className={cn(
                    "transition-all hover:shadow-lg border-2",
                    order.status === "ready_to_pay" 
                      ? "border-destructive/50 bg-destructive/5" 
                      : "border-warning/50 bg-warning/5"
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Mesa {order.tableNumber || "X"}</CardTitle>
                      <Badge 
                        variant={order.status === "ready_to_pay" ? "destructive" : "secondary"}
                      >
                        {order.status === "ready_to_pay" ? "Por Cobrar" : "Activa"}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Hace {timeElapsed} min
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Platos de Comida:</p>
                      <ScrollArea className="max-h-64">
                        <div className="space-y-2">
                          {foodItems.map((item) => {
                            const kitchenStatus = item.kitchenStatus || "pending";
                            
                            return (
                              <Card key={item.id} className="p-3">
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-bold">{item.name}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Cantidad: {item.quantity}
                                      </p>
                                    </div>
                                    <Badge 
                                      variant={
                                        kitchenStatus === "ready" 
                                          ? "default" 
                                          : kitchenStatus === "preparing" 
                                            ? "secondary" 
                                            : "outline"
                                      }
                                      className={cn(
                                        kitchenStatus === "ready" && "bg-green-500 text-white",
                                        kitchenStatus === "preparing" && "bg-blue-500 text-white",
                                        kitchenStatus === "pending" && "border-yellow-500 text-yellow-700"
                                      )}
                                    >
                                      {kitchenStatus === "pending" && "Pendiente"}
                                      {kitchenStatus === "preparing" && "Preparando"}
                                      {kitchenStatus === "ready" && "Listo"}
                                    </Badge>
                                  </div>

                                  {kitchenStatus === "pending" && (
                                    <Button 
                                      size="sm" 
                                      className="w-full"
                                      onClick={() => handleStartPreparing(order.tableId, item.id)}
                                    >
                                      <ChefHat className="mr-2 h-4 w-4" />
                                      Iniciar Preparación
                                    </Button>
                                  )}

                                  {kitchenStatus === "preparing" && (
                                    <Button 
                                      size="sm" 
                                      className="w-full bg-green-600 hover:bg-green-700"
                                      onClick={() => handleMarkReady(order.tableId, item.id, item.name, order.tableNumber)}
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Marcar como Listo
                                    </Button>
                                  )}

                                  {kitchenStatus === "ready" && (
                                    <div className="bg-green-500/10 p-2 rounded text-center">
                                      <p className="text-sm font-semibold text-green-700">
                                        ✓ Listo para servir
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>

                    <Separator />

                    {/* Resumen de la comanda */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total productos:</span>
                        <span className="font-semibold">{order.items.length}</span>
                      </div>
                      <div className="flex items-center justify-between bg-primary/10 p-2 rounded">
                        <span className="text-sm font-medium">Total comanda:</span>
                        <span className="font-bold text-primary flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenView;