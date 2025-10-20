import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type TableStatus = "available" | "occupied" | "reserved" | "cleaning";

interface Table {
  id: number;
  number: string;
  capacity: number;
  status: TableStatus;
  currentGuests?: number;
  orderTotal?: number;
  timeOccupied?: string;
}

const TablesView = () => {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, number: "1", capacity: 2, status: "occupied", currentGuests: 2, orderTotal: 45.50, timeOccupied: "45 min" },
    { id: 2, number: "2", capacity: 4, status: "available" },
    { id: 3, number: "3", capacity: 4, status: "occupied", currentGuests: 4, orderTotal: 120.00, timeOccupied: "1h 15min" },
    { id: 4, number: "4", capacity: 2, status: "reserved" },
    { id: 5, number: "5", capacity: 6, status: "available" },
    { id: 6, number: "6", capacity: 4, status: "cleaning" },
    { id: 7, number: "7", capacity: 2, status: "available" },
    { id: 8, number: "8", capacity: 8, status: "occupied", currentGuests: 6, orderTotal: 230.75, timeOccupied: "2h 30min" },
    { id: 9, number: "9", capacity: 4, status: "available" },
    { id: 10, number: "10", capacity: 2, status: "reserved" },
    { id: 11, number: "11", capacity: 4, status: "available" },
    { id: 12, number: "12", capacity: 6, status: "occupied", currentGuests: 5, orderTotal: 185.25, timeOccupied: "55 min" },
  ]);

  const getStatusConfig = (status: TableStatus) => {
    const configs = {
      available: {
        label: "Disponible",
        className: "bg-success hover:bg-success/90 text-success-foreground",
        badgeVariant: "default" as const,
      },
      occupied: {
        label: "Ocupada",
        className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
        badgeVariant: "destructive" as const,
      },
      reserved: {
        label: "Reservada",
        className: "bg-warning hover:bg-warning/90 text-warning-foreground",
        badgeVariant: "secondary" as const,
      },
      cleaning: {
        label: "Limpiando",
        className: "bg-info hover:bg-info/90 text-info-foreground",
        badgeVariant: "outline" as const,
      },
    };
    return configs[status];
  };

  const handleStatusChange = (tableId: number, newStatus: TableStatus) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, status: newStatus } : table
    ));
  };

  const tableStats = {
    available: tables.filter(t => t.status === "available").length,
    occupied: tables.filter(t => t.status === "occupied").length,
    reserved: tables.filter(t => t.status === "reserved").length,
    cleaning: tables.filter(t => t.status === "cleaning").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-success/20 bg-success/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{tableStats.available}</div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Ocupadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{tableStats.occupied}</div>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Reservadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{tableStats.reserved}</div>
          </CardContent>
        </Card>
        <Card className="border-info/20 bg-info/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Limpiando</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-info">{tableStats.cleaning}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Distribución de Mesas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => {
            const statusConfig = getStatusConfig(table.status);
            return (
              <Card key={table.id} className="overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className={cn("pb-3", statusConfig.className)}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Mesa {table.number}</CardTitle>
                    <Badge variant={statusConfig.badgeVariant} className="text-xs">
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <CardDescription className={cn(
                    "text-xs",
                    table.status === "available" || table.status === "cleaning" 
                      ? "text-success-foreground/80" 
                      : table.status === "occupied" 
                      ? "text-destructive-foreground/80"
                      : "text-warning-foreground/80"
                  )}>
                    <Users className="mr-1 inline h-3 w-3" />
                    Capacidad: {table.capacity} personas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {table.status === "occupied" && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Comensales:</span>
                        <span className="font-medium">{table.currentGuests}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          <Clock className="mr-1 inline h-3 w-3" />
                          Tiempo:
                        </span>
                        <span className="font-medium">{table.timeOccupied}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          <DollarSign className="mr-1 inline h-3 w-3" />
                          Total:
                        </span>
                        <span className="font-semibold text-primary">${table.orderTotal?.toFixed(2)}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleStatusChange(table.id, "cleaning")}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Finalizar Cuenta
                      </Button>
                    </>
                  )}
                  {table.status === "available" && (
                    <Button 
                      size="sm" 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => handleStatusChange(table.id, "occupied")}
                    >
                      Asignar Mesa
                    </Button>
                  )}
                  {table.status === "reserved" && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Reserva confirmada</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleStatusChange(table.id, "occupied")}
                      >
                        Confirmar Llegada
                      </Button>
                    </div>
                  )}
                  {table.status === "cleaning" && (
                    <Button 
                      size="sm" 
                      className="w-full bg-success hover:bg-success/90"
                      onClick={() => handleStatusChange(table.id, "available")}
                    >
                      Marcar como Disponible
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TablesView;
