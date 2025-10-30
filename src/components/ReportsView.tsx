import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, DollarSign, ShoppingCart, Package, Users, 
  Calendar, BarChart3, FileText, Download, Clock
} from "lucide-react";
import { useRestaurant } from "@/contexts/RestaurantContext";

const ReportsView = () => {
  const { orderHistory, inventory, reservations } = useRestaurant();
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "all">("today");

  // Filtrar órdenes por período
  const filterOrdersByPeriod = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return orderHistory.filter(order => {
      const orderDate = new Date(order.paidAt);
      switch (selectedPeriod) {
        case "today":
          return orderDate >= today;
        case "week":
          return orderDate >= weekAgo;
        case "month":
          return orderDate >= monthAgo;
        case "all":
        default:
          return true;
      }
    });
  };

  const filteredOrders = filterOrdersByPeriod();

  // Estadísticas generales
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Productos más vendidos
  const productSales = filteredOrders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.name]) {
        acc[item.name] = { quantity: 0, revenue: 0, category: item.category };
      }
      acc[item.name].quantity += item.quantity;
      acc[item.name].revenue += item.total;
    });
    return acc;
  }, {} as Record<string, { quantity: number; revenue: number; category: string }>);

  const topProducts = Object.entries(productSales)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Ventas por categoría
  const salesByCategory = filteredOrders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.category]) {
        acc[item.category] = { quantity: 0, revenue: 0 };
      }
      acc[item.category].quantity += item.quantity;
      acc[item.category].revenue += item.total;
    });
    return acc;
  }, {} as Record<string, { quantity: number; revenue: number }>);

  // Ventas por hora
  const salesByHour = filteredOrders.reduce((acc, order) => {
    const hour = new Date(order.paidAt).getHours();
    if (!acc[hour]) {
      acc[hour] = { orders: 0, revenue: 0 };
    }
    acc[hour].orders += 1;
    acc[hour].revenue += order.total;
    return acc;
  }, {} as Record<number, { orders: number; revenue: number }>);

  // Stock crítico
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
  const outOfStockItems = inventory.filter(item => item.quantity === 0);

  // Estadísticas de reservas
  const totalReservations = reservations.length;
  const completedReservations = reservations.filter(r => r.status === "completed").length;
  const cancelledReservations = reservations.filter(r => r.status === "cancelled").length;
  const conversionRate = totalReservations > 0 ? (completedReservations / totalReservations * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Reportes y Análisis</h2>
          <p className="text-muted-foreground">Análisis detallado del negocio</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Reporte
        </Button>
      </div>

      {/* Selector de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Período de Análisis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === "today" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("today")}
            >
              Hoy
            </Button>
            <Button
              variant={selectedPeriod === "week" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("week")}
            >
              Última Semana
            </Button>
            <Button
              variant={selectedPeriod === "month" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("month")}
            >
              Último Mes
            </Button>
            <Button
              variant={selectedPeriod === "all" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("all")}
            >
              Todo el Tiempo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Total Órdenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ticket Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">${averageTicket.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{completedReservations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasa conversión: {conversionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Reportes */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
        </TabsList>

        {/* Tab: Ventas */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Ventas por Categoría */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Ventas por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {Object.entries(salesByCategory)
                      .sort((a, b) => b[1].revenue - a[1].revenue)
                      .map(([category, data]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{category}</span>
                            <Badge variant="secondary">
                              ${data.revenue.toFixed(2)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{data.quantity} unidades vendidas</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(data.revenue / totalRevenue) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Ventas por Hora */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Ventas por Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {Object.entries(salesByHour)
                      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                      .map(([hour, data]) => (
                        <div key={hour} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                          <span className="font-medium">
                            {hour.padStart(2, '0')}:00 - {(parseInt(hour) + 1).toString().padStart(2, '0')}:00
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {data.orders} órdenes
                            </span>
                            <Badge>${data.revenue.toFixed(2)}</Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Historial de Órdenes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Historial de Órdenes
              </CardTitle>
              <CardDescription>
                Mostrando {filteredOrders.length} órdenes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">Mesa {order.tableNumber}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.paidAt).toLocaleString('es-ES')}
                            </p>
                          </div>
                          <Badge variant="default" className="text-lg">
                            ${order.total.toFixed(2)}
                          </Badge>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span className="text-muted-foreground">
                                ${item.total.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Productos */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top 10 Productos Más Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-2xl text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {product.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="text-lg">
                          ${product.revenue.toFixed(2)}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {product.quantity} vendidos
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(product.revenue / topProducts[0].revenue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Inventario */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Alertas de Stock */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                  <Package className="h-5 w-5" />
                  Alertas de Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-destructive mb-2">
                      Productos Agotados ({outOfStockItems.length})
                    </h4>
                    <div className="space-y-2">
                      {outOfStockItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-destructive/10 rounded">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="destructive">Agotado</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-yellow-600 mb-2">
                      Stock Bajo ({lowStockItems.length - outOfStockItems.length})
                    </h4>
                    <div className="space-y-2">
                      {lowStockItems
                        .filter(item => item.quantity > 0)
                        .map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-yellow-500/10 rounded">
                            <span className="font-medium">{item.name}</span>
                            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                              {item.quantity} {item.unit}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estado General del Inventario */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Estado del Inventario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{inventory.length}</p>
                      <p className="text-sm text-muted-foreground">Total Productos</p>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {inventory.filter(i => i.quantity > i.minStock).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Stock Normal</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        {lowStockItems.length - outOfStockItems.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Stock Bajo</p>
                    </div>
                    <div className="text-center p-4 bg-destructive/10 rounded-lg">
                      <p className="text-2xl font-bold text-destructive">
                        {outOfStockItems.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Agotados</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Valor del Inventario</h4>
                    <div className="space-y-2">
                      {inventory
                        .sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price))
                        .slice(0, 5)
                        .map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className="text-sm">{item.name}</span>
                            <span className="font-semibold">
                              ${(item.quantity * item.price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Reservas */}
        <TabsContent value="reservations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalReservations}</div>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{completedReservations}</div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{cancelledReservations}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Análisis de Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Tasa de Conversión</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-primary">{conversionRate}%</div>
                    <div className="text-sm text-muted-foreground">
                      {completedReservations} de {totalReservations} reservas fueron completadas
                    </div>
                  </div>
                  <div className="w-full bg-muted-foreground/20 rounded-full h-3 mt-3">
                    <div
                      className="bg-primary h-3 rounded-full"
                      style={{ width: `${conversionRate}%` }}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Reservas por Estado</h4>
                  <div className="space-y-2">
                    {[
                      { status: "pending", label: "Pendientes", count: reservations.filter(r => r.status === "pending").length },
                      { status: "confirmed", label: "Confirmadas", count: reservations.filter(r => r.status === "confirmed").length },
                      { status: "seated", label: "Sentados", count: reservations.filter(r => r.status === "seated").length },
                      { status: "completed", label: "Completadas", count: completedReservations },
                      { status: "cancelled", label: "Canceladas", count: cancelledReservations },
                    ].map((item) => (
                      <div key={item.status} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                        <span>{item.label}</span>
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Promedio de Personas por Reserva</h4>
                  <div className="text-3xl font-bold text-primary">
                    {reservations.length > 0
                      ? (reservations.reduce((sum, r) => sum + r.numberOfPeople, 0) / reservations.length).toFixed(1)
                      : 0}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">personas por reserva</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsView;