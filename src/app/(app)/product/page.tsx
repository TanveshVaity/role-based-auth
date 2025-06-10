"use client";

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
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/multi-select";
import { useAuth } from "@clerk/nextjs";

type Product = {
  id: string;
  name: string;
  description?: string;
  stock: number;
  price: number;
};

type Category = {
  id: string;
  name: string;
  description?: string;
};

const productFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(2, "Description is required"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  stock: z.coerce.number().min(0, "Stock can't be negative"),
  categories: z.array(z.string()).nonempty("Select at least one category"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function ProductTable() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { name: "", description: "", price: 0, stock: 0, categories: [] },
  });

  const { isLoaded, userId, sessionClaims } = useAuth();
  const isAdmin = sessionClaims?.metadata.role === 'admin';

  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get<Product[]>("/api/product"),
          axios.get<Category[]>("/api/categories")
        ]);
        
        setData(productsRes.data);
        setCats(categoriesRes.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading products…</p>;
  if (error) return <p className="p-6 text-center text-red-600">Error: {error}</p>;

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/product", values);
      setData(prevData => [...prevData, res.data]);      
      setOpen(false);
      form.reset();
    } catch (err: any) {
      console.error("Error creating product:", err);
      setError("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  }

  const transformedItems = cats.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  return (
    <div className="mt-6 px-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Products</h2>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Widget" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Product details" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={transformedItems}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            variant="inverted"
                            maxCount={3}
                            placeholder="Select categories..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-1/2 cursor-pointer"
                      onClick={() => setOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="text-white w-1/2 cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add Product"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-4 text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

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
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No products found. Add your first product!
              </TableCell>
            </TableRow>
          ) : (
            data.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell className="px-4 py-2">{prod.name}</TableCell>
                <TableCell className="px-4 py-2">
                  {prod.description ?? "—"}
                </TableCell>
                <TableCell className="px-4 py-2">{prod.stock}</TableCell>
                <TableCell className="px-4 py-2">
                  ₹ {prod.price.toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}