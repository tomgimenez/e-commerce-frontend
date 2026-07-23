import { useState } from "react"
import { Store, Bell, CreditCard, Truck, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminSettingsPage() {
  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    newCustomers: false,
    reviews: true,
    marketing: false,
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your store configuration and preferences.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="store" className="space-y-6 flex-col">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="store">
            <Store className="h-4 w-4 mr-2" />
            Store
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="h-4 w-4 mr-2" />
            Shipping
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Store Information</h2>
              <p className="text-sm text-muted-foreground">Basic details about your store.</p>
            </div>
            <Separator className="bg-border" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" defaultValue="The LoreVault Market" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="storeDesc">Description</Label>
                <Textarea
                  id="storeDesc"
                  rows={3}
                  defaultValue="Discover enchanting fantasy books from legendary worlds."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Contact Email</Label>
                <Input id="storeEmail" type="email" defaultValue="hello@lorevault.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone</Label>
                <Input id="storePhone" defaultValue="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="ars">ARS ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="et">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="et">Eastern Time (ET)</SelectItem>
                    <SelectItem value="ct">Central Time (CT)</SelectItem>
                    <SelectItem value="pt">Pacific Time (PT)</SelectItem>
                    <SelectItem value="art">Argentina Time (ART)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
              <p className="text-sm text-muted-foreground">Choose what updates you want to receive.</p>
            </div>
            <Separator className="bg-border" />
            <div className="space-y-1">
              {[
                { key: "newOrders" as const, label: "New Orders", desc: "Get notified when a customer places an order." },
                { key: "lowStock" as const, label: "Low Stock Alerts", desc: "Alert when a product's inventory runs low." },
                { key: "newCustomers" as const, label: "New Customers", desc: "Get notified when a new customer registers." },
                { key: "reviews" as const, label: "Product Reviews", desc: "Receive notifications for new product reviews." },
                { key: "marketing" as const, label: "Marketing Updates", desc: "Tips and news about growing your store." },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Payment Methods</h2>
              <p className="text-sm text-muted-foreground">Configure how customers can pay.</p>
            </div>
            <Separator className="bg-border" />
            <div className="space-y-1">
              {[
                { label: "Credit / Debit Cards", desc: "Accept Visa, Mastercard, and American Express.", on: true },
                { label: "Mercado Pago", desc: "Accept payments through Mercado Pago.", on: true },
                { label: "Bank Transfer", desc: "Allow manual bank transfer payments.", on: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.on} />
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input id="taxRate" type="number" defaultValue="8" />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Shipping Options</h2>
              <p className="text-sm text-muted-foreground">Set up delivery methods and rates.</p>
            </div>
            <Separator className="bg-border" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="freeThreshold">Free Shipping Threshold ($)</Label>
                <Input id="freeThreshold" type="number" defaultValue="50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="standardRate">Standard Shipping Rate ($)</Label>
                <Input id="standardRate" type="number" defaultValue="4.99" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expressRate">Express Shipping Rate ($)</Label>
                <Input id="expressRate" type="number" defaultValue="9.99" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="processingDays">Processing Time (days)</Label>
                <Input id="processingDays" type="number" defaultValue="2" />
              </div>
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">International Shipping</p>
                <p className="text-sm text-muted-foreground">Ship orders outside your home country.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
