-- Enable RLS
alter default privileges in schema public grant all on tables to postgres, service_role;

-- Partners (synced from Supabase Auth)
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Transactions (Capital + Expenses)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id),
  amount INTEGER NOT NULL, -- PKR, no decimals
  category TEXT NOT NULL CHECK (category IN ('marketing', 'packaging', 'fruit_stock', 'logistics', 'food_misc', 'capital_injection')),
  description TEXT NOT NULL,
  receipt_url TEXT, -- Optional but encouraged for audit trail
  -- has_receipt BOOLEAN GENERATED ALWAYS AS (receipt_url IS NOT NULL) STORED, -- Note: specific postgres version needed for generated columns, using view or app logic might be safer if version unknown, but standard pg12+ supports it.
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  product_variant TEXT NOT NULL CHECK (product_variant IN ('10kg', '5kg')),
  quantity INTEGER NOT NULL DEFAULT 1,
  sell_price INTEGER NOT NULL, -- PKR per unit
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'delivered', 'returned')),
  created_by UUID NOT NULL REFERENCES public.partners(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order Status History (Audit Trail)
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES public.partners(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Journal Entries
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id),
  content TEXT,
  image_urls TEXT[], -- Array of R2 URLs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT content_or_image CHECK (content IS NOT NULL OR array_length(image_urls, 1) > 0)
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Invited Emails (for registration restriction)
CREATE TABLE IF NOT EXISTS public.invited_emails (
  email TEXT PRIMARY KEY,
  invited_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.invited_emails ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Partners: Users can read all partners, but only update their own
CREATE POLICY "Partners are viewable by everyone" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Partners can update own profile" ON public.partners FOR UPDATE USING (auth.uid() = id);

-- Transactions: Viewable by all partners, created by authenticated partners
CREATE POLICY "Transactions viewable by all partners" ON public.transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Transactions insertable by authenticated partners" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = partner_id);
-- No delete/update policy for transactions (immutable)

-- Orders: Viewable by all, created by authenticated, updated by authenticated
CREATE POLICY "Orders viewable by all partners" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Orders insertable by authenticated partners" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Orders updatable by authenticated partners" ON public.orders FOR UPDATE TO authenticated USING (true);

-- Order History: Viewable by all, insertable by system (via triggers or app logic)
CREATE POLICY "Order history viewable by all" ON public.order_status_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Order history insertable by authenticated" ON public.order_status_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = changed_by);

-- Journal: Viewable by all, insertable by authenticated
CREATE POLICY "Journal entries viewable by all" ON public.journal_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Journal entries insertable by authenticated" ON public.journal_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = partner_id);

-- Invited Emails: Read-only for everyone (to check permissions), write only by admin/service role (manual entry)
CREATE POLICY "Invited emails viewable by everyone" ON public.invited_emails FOR SELECT USING (true);
