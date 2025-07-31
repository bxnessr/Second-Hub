
-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  address TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create waste_types table
CREATE TABLE IF NOT EXISTS waste_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  points_per_kg INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create waste_logs table
CREATE TABLE IF NOT EXISTS waste_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  waste_type_id UUID REFERENCES waste_types(id) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  points_earned INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create pickups table
CREATE TABLE IF NOT EXISTS pickups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time_start TIME NOT NULL,
  pickup_time_end TIME NOT NULL,
  waste_types TEXT[] NOT NULL,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_rewards table (for redeemed rewards)
CREATE TABLE IF NOT EXISTS user_rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES rewards(id) NOT NULL,
  points_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'redeemed',
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default waste types
INSERT INTO waste_types (name, points_per_kg, description) VALUES
('Recyclables', 10, 'Paper, plastic, glass, and metal items'),
('Compost', 8, 'Organic waste and food scraps'),
('Electronic', 30, 'E-waste and electronic devices'),
('General Waste', 5, 'Non-recyclable general waste');

-- Insert sample rewards
INSERT INTO rewards (name, description, points_required, image_url) VALUES
('$5 Gift Card', 'Redeem points for a $5 gift card', 500, '/placeholder.svg'),
('Eco-Friendly Water Bottle', 'Sustainable water bottle made from recycled materials', 200, '/placeholder.svg'),
('Plant Seedling Kit', 'Grow your own herbs and vegetables', 150, '/placeholder.svg'),
('Reusable Shopping Bag', 'Durable bag made from recycled plastic', 100, '/placeholder.svg');

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for waste_logs
CREATE POLICY "Users can view own waste logs" ON waste_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own waste logs" ON waste_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own waste logs" ON waste_logs FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for pickups
CREATE POLICY "Users can view own pickups" ON pickups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pickups" ON pickups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pickups" ON pickups FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for user_rewards
CREATE POLICY "Users can view own rewards" ON user_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rewards" ON user_rewards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow everyone to read waste_types and rewards (public data)
CREATE POLICY "Anyone can view waste types" ON waste_types FOR SELECT USING (true);
CREATE POLICY "Anyone can view rewards" ON rewards FOR SELECT USING (true);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, address, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'address',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate and update user points
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's total points when waste log is approved
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE profiles 
    SET points = points + NEW.points_earned,
        updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update points when waste log status changes
CREATE OR REPLACE TRIGGER on_waste_log_completed
  AFTER UPDATE ON waste_logs
  FOR EACH ROW EXECUTE FUNCTION update_user_points();
