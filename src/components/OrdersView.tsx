import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Eye } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface CustomerOrder {
  id: number;
  table: string;
  items: OrderItem[];
  total: number;
  status: "active" | "paid" | "pending";
  time: string;
}

const OrdersView = () => {
  const orders: CustomerOrder[] = [
    {
      id: 1,
      table: "Mesa 1",
      items: [
        { name: "Hamburguesa Classic", quantity: 1, price: 12.50 },
        { name: "Papas Fritas", quantity: 1, price: 5.00 },
      ],
      total: 17.50,
      status: "active",
      time: "12:30 PM"
    },
    {
      id: 2,
      table: "Mesa 3",
      items: [
        { name: "Pizza Margarita", quantity: 1, price: 15.00 },
        { name: "Ensalada César", quantity: 2, price: 16.00 },
        { name: "Pasta Carbonara", quantity: 1, price: 13.00 },
      ],
      total: 44.00,
      status: "active",
      time: "12:45 PM"
    },
    {
      id: 3,
      table: "Mesa 8",
      items: [
        { name: "Sushi Roll", quantity: 3, price: 36.00 },
        { name: "Sopa Miso", quantity: 2, price: 10.00 },
      ],
      total: 46.00,
      status: "pending",
      time: "1:00 PM"
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Pedidos</h2>
        <Badge variant="secondary" className="text-sm">
          {orders.length} pedidos
        </Badge>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{order.table}</CardTitle>
                  <CardDescription>{order.time}</CardDescription>
                </div>
                <Badge 
                  variant={order.status === "paid" ? "default" : order.status === "active" ? "secondary" : "outline"}
                  className={order.status === "paid" ? "bg-success text-success-foreground" : ""}
                >
                  {order.status === "pending" && "Pendiente"}
                  {order.status === "active" && "Activo"}
                  {order.status === "paid" && "Pagado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  <DollarSign className="inline h-5 w-5" />
                  {order.total.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalles
                </Button>
                {order.status === "active" && (
                  <Button size="sm" className="flex-1">
                    Procesar Pago
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersView;
