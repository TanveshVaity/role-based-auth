'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type Category = {
  id: string;
  name: string;
  description?: string;
};

export default function CategoryTable() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Category[]>("/api/categories")
      .then(res => setCats(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-center">Loading categories…</p>;
  if (error)   return <p className="p-6 text-center text-red-600">Error: {error}</p>;

  return (
    <div className="mt-6 px-4">
      <h2 className="text-3xl font-bold mb-4">Categories</h2>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl overflow-x-auto">
          <Table className="table-auto md:table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2 md:w-1/3">Name</TableHead>
                <TableHead className="px-4 py-2 md:w-2/3">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cats.map(cat => (
                <TableRow key={cat.id}>
                  <TableCell className="px-4 py-2">{cat.name}</TableCell>
                  <TableCell className="px-4 py-2">{cat.description ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
