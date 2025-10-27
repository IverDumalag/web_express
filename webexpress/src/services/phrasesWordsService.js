import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../config/supabaseClient';

/**
 * Phrases/Words Service - Handles all phrase and word card operations
 */

// Generate unique entry ID
const generateEntryId = () => {
  return `pw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Insert new phrase/word
export const insertPhrasesWords = async (data) => {
  try {
    const { user_id, words, sign_language, category, is_favorite, is_match } = data;

    const entryId = generateEntryId();

    const { data: result, error } = await supabase
      .from('tbl_phrases_words')
      .insert([
        {
          entry_id: entryId,
          user_id,
          words,
          sign_language: sign_language || null,
          category: category || null,
          is_favorite: is_favorite || false,
          is_match: is_match || false,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return handleSupabaseSuccess(result, 'Phrase/word added successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Get user's phrases/words
export const getPhrasesWordsByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('tbl_phrases_words')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return handleSupabaseSuccess(data || [], 'Phrases/words fetched successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Update phrase/word status (archive/unarchive)
export const updatePhrasesWordsStatus = async (entryId, status) => {
  try {
    const { data, error } = await supabase
      .from('tbl_phrases_words')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('entry_id', entryId)
      .select()
      .single();

    if (error) throw error;

    return handleSupabaseSuccess(data, 'Status updated successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Update favorite status
export const updatePhrasesWordsFavorite = async (entryId, isFavorite) => {
  try {
    const { data, error } = await supabase
      .from('tbl_phrases_words')
      .update({
        is_favorite: isFavorite,
        updated_at: new Date().toISOString()
      })
      .eq('entry_id', entryId)
      .select()
      .single();

    if (error) throw error;

    return handleSupabaseSuccess(data, 'Favorite status updated successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Edit phrase/word
export const editPhrasesWords = async (entryId, updates) => {
  try {
    const { words, sign_language } = updates;

    const { data, error } = await supabase
      .from('tbl_phrases_words')
      .update({
        words,
        sign_language: sign_language || null,
        updated_at: new Date().toISOString()
      })
      .eq('entry_id', entryId)
      .select()
      .single();

    if (error) throw error;

    return handleSupabaseSuccess(data, 'Phrase/word updated successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Delete phrase/word
export const deletePhrasesWords = async (entryId) => {
  try {
    const { error } = await supabase
      .from('tbl_phrases_words')
      .delete()
      .eq('entry_id', entryId);

    if (error) throw error;

    return handleSupabaseSuccess(null, 'Phrase/word deleted successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export default {
  insertPhrasesWords,
  getPhrasesWordsByUserId,
  updatePhrasesWordsStatus,
  updatePhrasesWordsFavorite,
  editPhrasesWords,
  deletePhrasesWords
};
