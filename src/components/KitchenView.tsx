import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2 } from "lucide-react";

interface Order {
  id: number;
  table: string;
  items: string[];
  status: "pending" | "preparing" | "ready";
  time: string;
}

const KitchenView = () => {
  const orders: Order[] = [
    { id: 1, table: "Mesa 1", items: ["Hamburguesa Classic", "Papas Fritas"], status: "preparing", time: "15 min" },
    { id: 2, table: "Mesa 3", items: ["Pizza Margarita", "Ensalada César", "Pasta Carbonara"], status: "pending", time: "5 min" },
    { id: 3, table: "Mesa 8", items: ["Sushi Roll x3", "Sopa Miso"], status: "ready", time: "25 min" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pedidos en Cocina</h2>
        <Badge variant="secondary" className="text-sm">
          {orders.length} pedidos activos
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{order.table}</CardTitle>
                <Badge 
                  variant={order.status === "ready" ? "default" : order.status === "preparing" ? "secondary" : "outline"}
                  className={order.status === "ready" ? "bg-success text-success-foreground" : ""}
                >
                  {order.status === "pending" && "Pendiente"}
                  {order.status === "preparing" && "Preparando"}
                  {order.status === "ready" && "Listo"}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {order.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-1 text-sm">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {order.status !== "ready" && (
                <Button size="sm" className="w-full">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {order.status === "pending" ? "Iniciar Preparación" : "Marcar como Listo"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KitchenView;
