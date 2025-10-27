import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../config/supabaseClient';

/**
 * Feedback Service - Handles feedback submissions and retrieval
 */

// Generate unique feedback ID
const generateFeedbackId = () => {
  return `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Submit feedback
export const insertFeedback = async (feedbackData) => {
  try {
    const { user_id, email, main_concern, details } = feedbackData;

    const feedbackId = generateFeedbackId();

    const { data, error } = await supabase
      .from('tbl_feedback')
      .insert([
        {
          feedback_id: feedbackId,
          user_id,
          email,
          main_concern,
          details,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return handleSupabaseSuccess(data, 'Feedback submitted successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Get all feedback (admin)
export const getAllFeedback = async () => {
  try {
    const { data, error } = await supabase
      .from('tbl_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return handleSupabaseSuccess(data || [], 'Feedback fetched successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export default {
  insertFeedback,
  getAllFeedback
};
