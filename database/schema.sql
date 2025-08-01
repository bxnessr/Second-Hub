
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

-- Create staff table (for admin/staff management)
CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  staff_id TEXT UNIQUE NOT NULL,
  department TEXT,
  position TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  service_areas UUID[] DEFAULT '{}',
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create service_areas table (for pickup zones)
CREATE TABLE IF NOT EXISTS service_areas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  coordinates JSONB, -- Store polygon/boundary coordinates
  is_active BOOLEAN DEFAULT true,
  pickup_days TEXT[] DEFAULT '{}', -- Days of the week for pickups
  pickup_times JSONB, -- Time slots available for pickups
  max_daily_pickups INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create notifications table (for user alerts)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'pickup_confirmation', 'reward_earned', 'pickup_reminder', 'system_alert'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data related to the notification
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
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

-- Insert sample service areas
INSERT INTO service_areas (name, description, pickup_days, pickup_times, max_daily_pickups) VALUES
('Downtown Area', 'Central business district and residential area', 
 ARRAY['Monday', 'Wednesday', 'Friday'], 
 '{"morning": "08:00-12:00", "afternoon": "13:00-17:00"}', 30),
('Suburban North', 'Northern suburban residential areas', 
 ARRAY['Tuesday', 'Thursday', 'Saturday'], 
 '{"morning": "09:00-12:00", "afternoon": "14:00-18:00"}', 40),
('Industrial Zone', 'Commercial and industrial areas', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 
 '{"morning": "07:00-11:00", "afternoon": "12:00-16:00"}', 20);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

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

-- Create policies for staff (only staff/admin can manage)
CREATE POLICY "Staff can view all staff" ON staff FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'staff')
  )
);
CREATE POLICY "Admin can manage staff" ON staff FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create policies for service_areas (public read, admin write)
CREATE POLICY "Anyone can view service areas" ON service_areas FOR SELECT USING (true);
CREATE POLICY "Admin can manage service areas" ON service_areas FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

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

-- Function to create notifications
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send pickup confirmation notifications
CREATE OR REPLACE FUNCTION notify_pickup_scheduled()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_notification(
    NEW.user_id,
    'pickup_confirmation',
    'Pickup Scheduled',
    'Your waste pickup has been scheduled for ' || NEW.pickup_date || '.',
    json_build_object('pickup_id', NEW.id, 'pickup_date', NEW.pickup_date)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send reward earned notifications
CREATE OR REPLACE FUNCTION notify_points_earned()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    PERFORM create_notification(
      NEW.user_id,
      'reward_earned',
      'Points Earned!',
      'You earned ' || NEW.points_earned || ' points for your waste submission.',
      json_build_object('waste_log_id', NEW.id, 'points', NEW.points_earned)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for notifications
CREATE OR REPLACE TRIGGER on_pickup_scheduled
  AFTER INSERT ON pickups
  FOR EACH ROW EXECUTE FUNCTION notify_pickup_scheduled();

CREATE OR REPLACE TRIGGER on_points_earned
  AFTER UPDATE ON waste_logs
  FOR EACH ROW EXECUTE FUNCTION notify_points_earned();
