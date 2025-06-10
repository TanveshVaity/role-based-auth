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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@clerk/nextjs';

const inventorySchema = z.object({
  productId: z.string().min(1, "Product is required"),
  available: z.coerce.number().min(0, "Must be 0 or greater"),
  sold: z.coerce.number().min(0, "Must be 0 or greater"),
});

type FormValues = z.infer<typeof inventorySchema>;

type Product = {
  id: string;
  name: string;
};

type InventoryItem = {
  id: string;
  available: number;
  sold: number;
  product: Product;
};


export default function InventoryTable() {
  const form = useForm<FormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: { productId: "", available: 0, sold: 0 },
  });
  
  const [data, setData] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  
  const { isLoaded, userId, sessionClaims } = useAuth();
  const isMaster = sessionClaims?.metadata.role === 'master';

  useEffect(() => {
    Promise.all([
      axios.get<InventoryItem[]>('/api/inventory'),
      axios.get<Product[]>('/api/product') 
    ])
      .then(([invRes, prodRes]) => {
        setData(invRes.data);
        setProducts(prodRes.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      await axios.post('/api/inventory', values);
      setOpen(false);
      form.reset();
      
      const res = await axios.get<InventoryItem[]>('/api/inventory');
      setData(res.data);
    } catch (err: any) {
      console.error("Error adding inventory:", err);
    }
  }

  if (loading) return <p className="p-6 text-center">Loading inventory…</p>;
  if (error) return <p className="p-6 text-center text-red-600">Error: {error}</p>;

  return (
    <div className="mt-6 px-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">Inventory</h2>
        {isMaster && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">Add Inventory</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Inventory Item</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    name="productId"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="available"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Units</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            placeholder="0"
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? '' : Number(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="sold"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sold Units</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            placeholder="0"
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? '' : Number(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setOpen(false)} 
                      className="w-1/2 cursor-pointer"
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="w-1/2 text-white cursor-pointer"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table className="table-auto md:table-fixed max-w-5xl mx-auto">
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
  );
}