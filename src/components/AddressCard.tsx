"use client";

import { Check, MapPin, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "@/store/addresses";
import { Button } from "@/components/ui/button";

type Props = {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
};

export default function AddressCard({ address, selected, onSelect, className }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border-2 bg-card p-4 text-right transition",
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/40",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <User className="size-4 text-primary" />
          {address.name}
        </div>
        {selected && (
          <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3" />
          </span>
        )}
        {address.isDefault && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            افتراضي
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Phone className="size-3.5" />
        <span dir="ltr">{address.phone}</span>
      </div>
      <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <MapPin className="size-3.5 mt-0.5 shrink-0" />
        <span className="leading-relaxed">
          {address.city} - {address.district} - {address.details}
          {address.landmark ? ` (${address.landmark})` : ""}
        </span>
      </div>
    </button>
  );
}

export function AddressCardWithActions({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  className,
}: {
  address: Address;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-border bg-card p-4",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <User className="size-4 text-primary" />
          {address.name}
        </div>
        {address.isDefault && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            افتراضي
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Phone className="size-3.5" />
        <span dir="ltr">{address.phone}</span>
      </div>
      <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <MapPin className="size-3.5 mt-0.5 shrink-0" />
        <span className="leading-relaxed">
          {address.city} - {address.district} - {address.details}
          {address.landmark ? ` (${address.landmark})` : ""}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        {onEdit && (
          <Button size="sm" variant="outline" onClick={onEdit} className="h-8 text-xs">
            تعديل
          </Button>
        )}
        {onSetDefault && !address.isDefault && (
          <Button
            size="sm"
            variant="outline"
            onClick={onSetDefault}
            className="h-8 text-xs"
          >
            تعيين كافتراضي
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="h-8 text-xs text-destructive hover:bg-destructive/5 hover:text-destructive"
          >
            حذف
          </Button>
        )}
      </div>
    </div>
  );
}
