import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ClipboardList, DollarSign } from "lucide-react";
import { useRestaurant } from "@/contexts/RestaurantContext";

const OrdersView = () => {
  const { tableOrders } = useRestaurant();

  const activeOrders = Object.values(tableOrders);
  const totalRevenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const readyToPayOrders = activeOrders.filter(order => order.status === "ready_to_pay");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestión de Pedidos</h2>
          <p className="text-muted-foreground">Vista de todos los pedidos activos</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeOrders.length}</div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Por Cobrar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{readyToPayOrders.length}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Pendiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Pedidos Activos
        </h3>

        {activeOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ClipboardList className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg">No hay pedidos activos</p>
              <p className="text-sm">Los pedidos de las mesas aparecerán aquí</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeOrders.map((order) => (
              <Card 
                key={order.tableId} 
                className={
                  order.status === "ready_to_pay" 
                    ? "border-destructive/50 bg-destructive/5" 
                    : "border-warning/50 bg-warning/5"
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Mesa {order.tableNumber}</CardTitle>
                    <Badge 
                      variant={order.status === "ready_to_pay" ? "destructive" : "secondary"}
                    >
                      {order.status === "ready_to_pay" ? "Por Cobrar" : "Activa"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {new Date(order.createdAt).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Productos:</p>
                    <ScrollArea className="max-h-40">
                      <ul className="space-y-1">
                        {order.items.map((item) => (
                          <li key={item.id} className="text-sm flex justify-between">
                            <span>
                              <span className="font-medium">{item.quantity}x</span> {item.name}
                            </span>
                            <span className="text-muted-foreground">
                              ${item.total.toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-primary flex items-center gap-1">
                      <DollarSign className="h-5 w-5" />
                      {order.total.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersView;