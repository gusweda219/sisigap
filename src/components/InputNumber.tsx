import { useEffect, useState } from "react";
import { CellContext } from "@tanstack/react-table";
import { Input } from "./ui/input";

interface InputNumberProps<TData, TValue> extends CellContext<TData, TValue> {
  min?: number;
  max?: number;
}

export const InputNumber = <TData, TValue>({
  getValue,
  row: { index },
  column: { id },
  table,
  min,
  max,
}: InputNumberProps<TData, TValue>) => {
  const initialValue = getValue() as string;

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => {
        e.target.focus();

        const inputValue = e.target.value.replace(/[^0-9]/g, "");
        const parsedValue = parseInt(inputValue, 10);

        if (isNaN(parsedValue)) {
          setValue("0");
          return;
        }

        if (max && parsedValue > max) {
          setValue(`${max}`);
          return;
        }
        if (min && parsedValue < 0) {
          setValue(`${min}`);
          return;
        }

        setValue(`${parsedValue}`);
      }}
      onBlur={(e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, "");
        const parsedValue = parseInt(inputValue, 10);

        if (min && parsedValue < min) {
          setValue(`${min}`);
          table.options.meta?.updateData?.(index, id, min);
          return;
        }

        table.options.meta?.updateData?.(index, id, value);
      }}
      onKeyDown={(e) => {
        if (e.key === ",") {
          e.preventDefault();
        }

        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
};
