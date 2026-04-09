import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { toast } from 'sonner';
import { FileText, RefreshCcw, Check, Truck, XCircle, PackageCheck, History } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Input } from '@/src/components/ui/input';

export default function AdminPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrderLogs, setSelectedOrderLogs] = useState<any[]>([]);
  const [payoutInfo, setPayoutInfo] = useState({ method: 'bank', details: '' });
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [orderToRefund, setOrderToRefund] = useState<number | null>(null);

  const fetchOrders = () => {
    const url = statusFilter === 'all' ? '/api/orders' : `/api/orders?status=${statusFilter}`;
    fetch(url).then(res => res.json()).then(setOrders);
  };

  const fetchProducts = () => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [statusFilter]);

  const updateStatus = async (id: number, status: string, extraData?: any) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extraData })
    });
    if (res.ok) {
      toast.success(`Order ${id} updated to ${status}`);
      fetchOrders();
    } else {
      const data = await res.json();
      toast.error(data.error || 'Failed to update status');
    }
  };

  const viewLogs = async (id: number) => {
    const res = await fetch(`/api/logs/order/${id}`);
    const data = await res.json();
    setSelectedOrderLogs(data);
  };

  const handleRefund = (id: number) => {
    setOrderToRefund(id);
    setIsPayoutDialogOpen(true);
  };

  const submitRefund = async () => {
    if (orderToRefund) {
      await updateStatus(orderToRefund, 'refunded', { payout_info: payoutInfo });
      setIsPayoutDialogOpen(false);
      setOrderToRefund(null);
      setPayoutInfo({ method: 'bank', details: '' });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      received: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-purple-100 text-purple-800',
      shipped: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      canceled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800',
      'awaiting return': 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-emerald-100 text-emerald-800'
    };
    return <Badge className={colors[status] || ''}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
        <div className="flex gap-4">
          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => toast.info("In a real OS, this would open the logs folder.")}>
            <FileText className="mr-2 h-4 w-4" /> {t('admin.open_logs_dir')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">{t('admin.orders')}</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{order.total_price} NOK</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {order.status === 'received' && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, 'confirmed')}>
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, 'shipped')}>
                            <Truck className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === 'shipped' && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, 'delivered')}>
                            <PackageCheck className="h-4 w-4" />
                          </Button>
                        )}
                        {['received', 'confirmed'].includes(order.status) && (
                          <Button size="sm" variant="destructive" onClick={() => updateStatus(order.id, 'canceled')}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === 'delivered' && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, 'awaiting return')}>
                            <RefreshCcw className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === 'returned' && (
                          <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleRefund(order.id)}>
                            <History className="h-4 w-4 mr-1" /> Refund
                          </Button>
                        )}
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="ghost" onClick={() => viewLogs(order.id)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{t('admin.order_logs')} #{order.id}</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                              {selectedOrderLogs.map((log, i) => (
                                <div key={i} className={`mb-2 p-2 rounded text-xs font-mono ${log.type === 'business' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                                  <span className="font-bold uppercase mr-2">[{log.type}]</span>
                                  {log.type === 'business' ? log.message : `${log.timestamp} ${log.level}: ${log.message}`}
                                </div>
                              ))}
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                    </TableCell>
                    <TableCell>#{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.price} NOK</TableCell>
                    <TableCell>{product.stock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payout for Order #{orderToRefund}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payout Method</label>
              <Select 
                value={payoutInfo.method} 
                onValueChange={(v) => setPayoutInfo(p => ({ ...p, method: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="card">Credit Card Refund</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Details / Card Number</label>
              <Input 
                placeholder="Enter account number or card details" 
                value={payoutInfo.details}
                onChange={(e) => setPayoutInfo(p => ({ ...p, details: e.target.value }))}
              />
            </div>
            <Button className="w-full" onClick={submitRefund} disabled={!payoutInfo.details}>
              Confirm Payout & Refund
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
