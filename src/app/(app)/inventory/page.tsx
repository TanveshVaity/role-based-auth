'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type InventoryItem = {
  id: string;
  available: number;
  sold: number;
  product: {
    id: string;
    name: string;
  };
};

export default function InventoryTable() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<InventoryItem[]>('/api/inventory')
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-center">Loading inventory…</p>;
  if (error) return <p className="p-6 text-center text-red-600">Error: {error}</p>;

  return (
    <div className="mt-6 px-4">
      <h2 className="text-3xl font-bold mb-4 ">Inventory</h2>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl overflow-x-auto">
          <Table className="table-auto md:table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2 md:w-1/3">Product Name</TableHead>
                <TableHead className="px-4 py-2 md:w-1/3">Available Units</TableHead>
                <TableHead className="px-4 py-2 md:w-1/3">Sold Units</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="px-4 py-2">{item.product.name}</TableCell>
                  <TableCell className="px-4 py-2">{item.available}</TableCell>
                  <TableCell className="px-4 py-2">{item.sold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
