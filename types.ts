export interface Song {
  id: string;
  user_id: string;
  author: string;
  title: string;
  song_path: string;
  image_path: string;
}

export interface Product {
  id: string;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  //   metadata?: Stripe.Metadata;
}

export interface Customer {
  id: string;
  //   stripe_customer_id?: string;
}

export interface UserDetails {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
  //   billing_address?: Stripe.Address;
  //   payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

