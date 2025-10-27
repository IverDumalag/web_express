import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../config/supabaseClient';
import bcrypt from 'bcryptjs'; // You'll need to install this: npm install bcryptjs

/**
 * User Service - Handles all user-related database operations
 */

// Generate unique user ID
const generateUserId = async () => {
  try {
    const { data, error } = await supabase
      .from('tbl_users')
      .select('user_id')
      .order('user_id', { ascending: false })
      .limit(1);

    if (error) throw error;

    let nextNumber = 1;
    if (data && data.length > 0) {
      const lastId = data[0].user_id;
      const numberPart = parseInt(lastId.split('-')[1]);
      nextNumber = numberPart + 1;
    }

    return `US-${String(nextNumber).padStart(7, '0')}`;
  } catch (error) {
    console.error('Error generating user ID:', error);
    return `US-${String(Date.now()).slice(-7)}`;
  }
};

// Register new user
export const registerUser = async (userData) => {
  try {
    const { email, password, f_name, m_name, l_name, sex, birthdate } = userData;

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('tbl_users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }

    // Generate user ID
    const userId = await generateUserId();

    // Hash password (using bcrypt in browser - note: consider doing this server-side for production)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data, error } = await supabase
      .from('tbl_users')
      .insert([
        {
          user_id: userId,
          email,
          password: hashedPassword,
          f_name,
          m_name: m_name || null,
          l_name,
          sex,
          birthdate,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Create log entry
    await createLog({
      user_id: userId,
      email,
      user_role: 'user',
      action_type: 'register',
      object_type: 'user',
      object_id: userId,
      new_data: { email, f_name, l_name }
    });

    return handleSupabaseSuccess(data, 'User registered successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    // Get user by email
    const { data: user, error } = await supabase
      .from('tbl_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Create log entry
    await createLog({
      user_id: user.user_id,
      email: user.email,
      user_role: 'user',
      action_type: 'login',
      object_type: 'user',
      object_id: user.user_id
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return handleSupabaseSuccess(userWithoutPassword, 'Login successful');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Update user profile
export const updateUser = async (userId, userData) => {
  try {
    const { email, f_name, m_name, l_name, sex, birthdate, password } = userData;

    const updateData = {
      email,
      f_name,
      m_name: m_name || null,
      l_name,
      sex,
      birthdate,
      updated_at: new Date().toISOString()
    };

    // If password is provided, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const { data, error } = await supabase
      .from('tbl_users')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return handleSupabaseSuccess(data, 'User updated successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Check if email exists
export const checkEmailExists = async (email) => {
  try {
    const { data, error } = await supabase
      .from('tbl_users')
      .select('user_id')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      success: true,
      exists: !!data,
      message: data ? 'Email is already registered' : 'Email is available'
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Get all users (admin)
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('tbl_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return handleSupabaseSuccess(data, 'Users fetched successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Helper function to create log entries
const createLog = async (logData) => {
  try {
    const logId = `log_${Date.now()}`;
    
    await supabase
      .from('tbl_log_history')
      .insert([
        {
          log_id: logId,
          ...logData,
          created_at: new Date().toISOString()
        }
      ]);
  } catch (error) {
    console.error('Error creating log:', error);
  }
};

export default {
  registerUser,
  loginUser,
  updateUser,
  checkEmailExists,
  getAllUsers
};
