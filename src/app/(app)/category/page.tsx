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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiSelect } from "@/components/multi-select";
import { useAuth } from "@clerk/nextjs";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  products: z.array(z.string()).nonempty("Select at least one product"),
});
type FormValues = z.infer<typeof categorySchema>;

type Product = { id: string; name: string; };

export default function CategoryTable() {
  const form = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", products: [] },
  });

  const { isLoaded, userId, sessionClaims } = useAuth();
  const isAdmin = sessionClaims?.metadata.role === 'admin';

  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState<{ id: string; name: string; description?: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      axios.get("/api/categories"),
      axios.get("/api/product"),
    ])
      .then(([cRes, pRes]) => {
        setCats(cRes.data);
        setProducts(pRes.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      await axios.post("/api/categories", values);
      setOpen(false);
      form.reset();
      const cRes = await axios.get("/api/categories");
      setCats(cRes.data);
    } catch (err: any) {
      console.error("Error adding category:", err);
    }
  }

  if (loading) return <p className="p-6 text-center">Loading…</p>;
  if (error) return <p className="p-6 text-center text-red-600">Error: {error}</p>;

  return (
    <div className="mt-6 px-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">Categories</h2>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">Add Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Category</DialogTitle></DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="description" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="products" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Products</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={products.map(p => ({ value: p.id, label: p.name }))}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          variant="inverted"
                          maxCount={3}
                          placeholder="Select products"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} className="w-1/2 cursor-pointer">Cancel</Button>
                    <Button type="submit" className="w-1/2 text-white cursor-pointer">Save</Button>
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
  );
}
