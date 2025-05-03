"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export function DatePickerWithPresets({
  date,
  setDate,
  className,
}: React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {/* data em portugues */}
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                <>
                  {/* data em portugues */}
                  {format(date.from, "LLL dd, y")}
                </>
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <Select
            onValueChange={(value) =>
              setDate({
                from: addDays(new Date(), -Number(value)),
                to: new Date(),
              })
            }
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="0">Hoje</SelectItem>
              <SelectItem value="1">Ontem</SelectItem>
              <SelectItem value="6">Últimos 7 dias</SelectItem>
              <SelectItem value="13">Últimos 14 dias</SelectItem>
              <SelectItem value="29">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
