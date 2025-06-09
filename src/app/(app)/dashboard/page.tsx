'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

type DashboardStats = {
  totalProducts: number;
  totalCategories: number;
  totalInventory: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<DashboardStats>("/api/dashboard")
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-600">Error: {error}</p>;
  }

  if (!stats) {
    return null;
  }

  const items = [
    { title: 'Total Products', value: stats.totalProducts },
    { title: 'Total Categories', value: stats.totalCategories },
    { title: 'Total Inventory', value: stats.totalInventory },
  ];

  return (
    <div className="flex flex-col p-6">
      <h2 className="text-3xl font-bold leading-tight min-w-72 mb-8 justify-items-start">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {items.map((item, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow w-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
