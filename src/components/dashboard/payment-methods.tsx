import { useState } from "react";
import { CreditCard, Plus, Trash2, Check, Building2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { usePaymentMethods, useCreatePaymentMethod, useDeletePaymentMethod, useSetDefaultPaymentMethod, type CreatePaymentMethodData } from "@/hooks/use-payment-methods";

export function PaymentMethods() {
  const { data: user } = useLoggedInUser();
  const { data: paymentMethods, isLoading } = usePaymentMethods(user?.id?.toString() || "");
  const createMutation = useCreatePaymentMethod();
  const deleteMutation = useDeletePaymentMethod();
  const setDefaultMutation = useSetDefaultPaymentMethod();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [methodType, setMethodType] = useState<"paypal" | "bank" | "crypto">("paypal");
  const [formData, setFormData] = useState<CreatePaymentMethodData>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createMutation.mutateAsync(formData);
      toast({
        title: "Success",
        description: "Payment method added successfully",
      });
      setIsDialogOpen(false);
      setFormData({});
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;
    
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Payment method deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Default payment method updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getPaymentMethodDisplay = (method: any) => {
    if (method.paypal_email) {
      return (
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-blue-500" />
          <div>
            <p className="font-medium">PayPal</p>
            <p className="text-sm text-muted-foreground">{method.paypal_email}</p>
          </div>
        </div>
      );
    }
    
    if (method.bank_account_number) {
      return (
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium">{method.bank_name}</p>
            <p className="text-sm text-muted-foreground">****{method.bank_account_number.slice(-4)}</p>
            <p className="text-sm text-muted-foreground">{method.bank_account_holder}</p>
          </div>
        </div>
      );
    }
    
    if (method.wallet_address) {
      return (
        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5 text-orange-500" />
          <div>
            <p className="font-medium">{method.wallet_type}</p>
            <p className="text-sm text-muted-foreground">{method.wallet_address.slice(0, 20)}...</p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading payment methods...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment Methods</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Method
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Payment Type</Label>
                  <Select value={methodType} onValueChange={(value: any) => setMethodType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank">Bank Account</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {methodType === "paypal" && (
                  <div>
                    <Label htmlFor="paypal_email">PayPal Email</Label>
                    <Input
                      id="paypal_email"
                      type="email"
                      value={formData.paypal_email || ""}
                      onChange={(e) => setFormData({ ...formData, paypal_email: e.target.value })}
                      required
                    />
                  </div>
                )}

                {methodType === "bank" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bank_account_holder">Account Holder Name</Label>
                      <Input
                        id="bank_account_holder"
                        value={formData.bank_account_holder || ""}
                        onChange={(e) => setFormData({ ...formData, bank_account_holder: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank_account_number">Account Number</Label>
                      <Input
                        id="bank_account_number"
                        value={formData.bank_account_number || ""}
                        onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank_name">Bank Name</Label>
                      <Input
                        id="bank_name"
                        value={formData.bank_name || ""}
                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank_ifsc_code">IFSC Code</Label>
                      <Input
                        id="bank_ifsc_code"
                        value={formData.bank_ifsc_code || ""}
                        onChange={(e) => setFormData({ ...formData, bank_ifsc_code: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank_swift_code">SWIFT Code (Optional)</Label>
                      <Input
                        id="bank_swift_code"
                        value={formData.bank_swift_code || ""}
                        onChange={(e) => setFormData({ ...formData, bank_swift_code: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Account Type</Label>
                      <Select value={formData.bank_account_type || "savings"} onValueChange={(value: any) => setFormData({ ...formData, bank_account_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {methodType === "crypto" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="wallet_address">Wallet Address</Label>
                      <Input
                        id="wallet_address"
                        value={formData.wallet_address || ""}
                        onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="wallet_type">Wallet Type</Label>
                      <Input
                        id="wallet_type"
                        placeholder="e.g., Bitcoin, Ethereum, USDT"
                        value={formData.wallet_type || ""}
                        onChange={(e) => setFormData({ ...formData, wallet_type: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Adding..." : "Add Method"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods?.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                {getPaymentMethodDisplay(method)}
                {method.is_default === 1 && (
                  <Badge variant="secondary">
                    <Check className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                {method.is_default === 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                    disabled={setDefaultMutation.isPending}
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(method.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {(!paymentMethods || paymentMethods.length === 0) && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payment methods added yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}