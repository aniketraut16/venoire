export type AddressType = {
    id: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string | null;
    postal_code: string;
    country: string;
    is_default: boolean;
  };
  
  export type CreateAddressArgs = {
    address_line1: string;
    address_line2?: string;
    city: string;
    postal_code: string;
    country: string;
    state?: string;
    is_default?: boolean;
  };