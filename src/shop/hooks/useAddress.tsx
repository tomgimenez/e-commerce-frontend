import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createAddress, getAddresses, type AddressPayload } from "../api/address.api"
import { useAuthStore } from "@/auth/store/auth.store"
import type { Address } from "@/interfaces/address.interface"
import { toast } from "sonner"

export const useAddress = () => {
  const { authStatus } = useAuthStore();
  const queryClient = useQueryClient();
  const isLoggedIn = authStatus === 'authenticated';

  const { data: addresses, isLoading } = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: () => getAddresses(),
    retry: false,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
    select: (data) => data ?? []
  });

const createAddressMutation = useMutation({
    mutationFn: (address: AddressPayload) => createAddress(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });

      toast.success('Address saved correctly');
    }
  });

  return {
    addresses: addresses ?? [],
    isLoading,
    createAddress: createAddressMutation.mutate
  };
}
