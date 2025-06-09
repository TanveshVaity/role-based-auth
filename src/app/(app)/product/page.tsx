'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  name: string;
  description?: string;
  stock: number;
  price: number;
};

export default function ProductTable() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    axios.get<Product[]>("/api/product")
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-center">Loading products…</p>;
  if (error)   return <p className="p-6 text-center text-red-600">Error: {error}</p>;

  return (
    <div className="mt-6 px-4 overflow-x-auto">
      <div className="relative flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Products</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Open
            </Button>
          </PopoverTrigger>
          <PopoverContent className="absolute top-1/2 right-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 p-4 z-50">
            Place content for the popover here.
          </PopoverContent>
        </Popover>
      </div>
      <Table className="table-auto md:table-fixed [&_:is(th,td):nth-child(4)]:text-right max-w-5xl mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 md:w-1/4">Name</TableHead>
            <TableHead className="px-4 py-2 md:w-1/2">Description</TableHead>
            <TableHead className="px-4 py-2 md:w-1/4">Stock</TableHead>
            <TableHead className="px-4 py-2 md:w-1/4">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(prod => (
            <TableRow key={prod.id}>
              <TableCell className="px-4 py-2">{prod.name}</TableCell>
              <TableCell className="px-4 py-2">{prod.description ?? "—"}</TableCell>
              <TableCell className="px-4 py-2">{prod.stock}</TableCell>
              <TableCell className="px-4 py-2">₹ {prod.price.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}