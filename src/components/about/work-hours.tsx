import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock } from "lucide-react";

export default function WorkHours() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <Clock className="mr-2 h-5 w-5 text-[#73067D]" />
          Horários de Funcionamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Sexta e Sábado:</span>
            <span>18:00 até 00:00</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Domingo:</span>
            <span>16:00 até 22:00</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Segunda a Quinta:</span>
            <span>Fechado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
