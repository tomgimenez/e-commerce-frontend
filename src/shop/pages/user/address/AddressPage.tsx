import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Address } from "@/interfaces/address.interface";
import { Home, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";

const savedAddresses: Address[] = [
  {
    id: "addr_1",
    name: "Home",
    street: "Bagshot Row",
    number: "3",
    city: "Hobbiton",
    floor: "",
    apartment: "",
    between_streets: "Party Field & The Water",
    notes: "Green round door, ring twice.",
    state: "The Shire",
    zip_code: "10001",
    country: "Middle-earth",
    is_default: true,
    userId: "user_1",
  },
  {
    id: "addr_2",
    name: "Work",
    street: "Diagon Alley",
    number: "93",
    city: "London",
    floor: "2",
    apartment: "B",
    between_streets: "Knockturn Alley & Gringotts",
    notes: "Ask for the wandmaker.",
    state: "England",
    zip_code: "WC2N",
    country: "United Kingdom",
    is_default: false,
    userId: "user_1",
  },
];

export const AddressPage = () => {

  const [addresses] = useState<Address[]>(savedAddresses);
  
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">
            My Addresses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage where your enchanted tomes are delivered.
          </p>
        </div>
        <Button
          // onClick={openAddDialog}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary mb-4">
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No addresses yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Add your first delivery address to get started.
            </p>
            <Button
              // onClick={openAddDialog}
              variant="outline"
              className="border-border"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="bg-card border-border">
              <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                      {address.name}
                      {address.is_default && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <Star className="h-3 w-3" />
                          Default
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {address.street} {address.number}
                      {address.floor && `, Floor ${address.floor}`}
                      {address.apartment && `, Apt ${address.apartment}`}
                      <br />
                      {address.city}, {address.state}, {address.zip_code}
                      <br />
                      {address.country}
                      {address.between_streets && (
                        <>
                          <br />
                          <span className="text-xs">
                            Between: {address.between_streets}
                          </span>
                        </>
                      )}
                      {address.notes && (
                        <>
                          <br />
                          <span className="text-xs italic">
                            {address.notes}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    // onClick={() => openEditDialog(address)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    // onClick={() => setDeleteId(address.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardHeader>
              {!address.is_default && (
                <CardContent className="pt-0">
                  <Button
                    variant="link"
                    size="sm"
                    // onClick={() => setAsDefault(address.id)}
                    className="h-auto p-0 text-primary"
                  >
                    Set as default
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
