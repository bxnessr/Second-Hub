
import { supabase } from './supabase'

export const database = {
  // Profile functions
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Waste log functions
  async createWasteLog(wasteLog: any) {
    const { data, error } = await supabase
      .from('waste_logs')
      .insert(wasteLog)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getWasteLogs(userId: string) {
    const { data, error } = await supabase
      .from('waste_logs')
      .select(`
        *,
        waste_types (name, points_per_kg)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Pickup functions
  async createPickup(pickup: any) {
    const { data, error } = await supabase
      .from('pickups')
      .insert(pickup)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getPickups(userId: string) {
    const { data, error } = await supabase
      .from('pickups')
      .select('*')
      .eq('user_id', userId)
      .order('pickup_date', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Waste types
  async getWasteTypes() {
    const { data, error } = await supabase
      .from('waste_types')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  // Rewards
  async getRewards() {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('available', true)
      .order('points_required')
    
    if (error) throw error
    return data
  },

  async redeemReward(userId: string, rewardId: string, pointsSpent: number) {
    const { data, error } = await supabase
      .from('user_rewards')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        points_spent: pointsSpent
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Staff functions
  async getStaff() {
    const { data, error } = await supabase
      .from('staff')
      .select(`
        *,
        profiles!staff_user_id_fkey(first_name, last_name, phone)
      `)
      .eq('is_active', true)
      .order('created_at')
    
    if (error) throw error
    return data
  },

  async createStaff(staffData: any) {
    const { data, error } = await supabase
      .from('staff')
      .insert(staffData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Service areas functions
  async getServiceAreas() {
    const { data, error } = await supabase
      .from('service_areas')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (error) throw error
    return data
  },

  async createServiceArea(areaData: any) {
    const { data, error } = await supabase
      .from('service_areas')
      .insert(areaData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Notifications functions
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(50)
    
    if (error) throw error
    return data
  },

  async markNotificationRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', notificationId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUnreadNotificationCount(userId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)
    
    if (error) throw error
    return count || 0
  }
}
