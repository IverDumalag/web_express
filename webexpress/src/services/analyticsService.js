import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../config/supabaseClient';

/**
 * Analytics Service - Handles all analytics queries
 */

// Get content match analytics
export const getContentMatchAnalytics = async () => {
  try {
    const { data, error } = await supabase
      .from('tbl_phrases_words')
      .select('words, is_match');

    if (error) throw error;

    // Group by words and get max is_match
    const wordsMap = {};
    data.forEach(row => {
      const word = row.words;
      if (!wordsMap[word]) {
        wordsMap[word] = false;
      }
      if (row.is_match) {
        wordsMap[word] = true;
      }
    });

    const result = Object.entries(wordsMap).map(([words, is_matched]) => ({
      words,
      is_matched
    })).sort((a, b) => a.words.localeCompare(b.words));

    return handleSupabaseSuccess(result, 'Content match analytics fetched successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Get content match rate
export const getContentMatchRate = async () => {
  try {
    const { data, error } = await supabase
      .from('tbl_phrases_words')
      .select('entry_id, is_match, created_at');

    if (error) throw error;

    // Calculate overall match rate
    const total = data.length;
    const matched = data.filter(row => row.is_match).length;
    const overallMatchRate = total > 0 ? (matched * 100.0 / total) : 0.0;

    // Calculate monthly trend
    const monthlyData = {};
    data.forEach(row => {
      const month = row.created_at.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, matched: 0 };
      }
      monthlyData[month].total++;
      if (row.is_match) {
        monthlyData[month].matched++;
      }
    });

    const monthlyTrend = Object.entries(monthlyData)
      .map(([month, counts]) => ({
        creation_month: month,
        monthly_match_rate: counts.total > 0 ? (counts.matched * 100.0 / counts.total) : 0.0
      }))
      .sort((a, b) => a.creation_month.localeCompare(b.creation_month));

    return handleSupabaseSuccess({
      overall_match_rate: overallMatchRate,
      monthly_trend: monthlyTrend
    }, 'Content match rate analytics fetched successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Get demographics by age
export const getDemographicsByAge = async () => {
  try {
    const { data, error } = await supabase
      .from('tbl_users')
      .select('user_id, birthdate');

    if (error) throw error;

    const ageGroups = {
      'Children': 0,
      'Teens': 0,
      'Young Adults': 0,
      'Adults': 0,
      'Middle Age Adults': 0,
      'Senior Adults': 0
    };

    data.forEach(user => {
      const birthdate = new Date(user.birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthdate.getFullYear();

      if (age >= 0 && age <= 12) {
        ageGroups['Children']++;
      } else if (age >= 13 && age <= 19) {
        ageGroups['Teens']++;
      } else if (age >= 18 && age <= 29) {
        ageGroups['Young Adults']++;
      } else if (age >= 20 && age <= 39) {
        ageGroups['Adults']++;
      } else if (age >= 40 && age <= 59) {
        ageGroups['Middle Age Adults']++;
      } else if (age >= 60) {
        ageGroups['Senior Adults']++;
      }
    });

    const result = Object.entries(ageGroups).map(([age_group, user_count]) => ({
      age_group,
      user_count
    }));

    return handleSupabaseSuccess(result, 'Demographics by age fetched successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Get demographics by sex
export const getDemographicsBySex = async () => {
  try {
    const { data, error } = await supabase
      .from('tbl_users')
      .select('user_id, sex');

    if (error) throw error;

    const sexCounts = {};
    const total = data.length;

    data.forEach(user => {
      const sex = user.sex;
      if (!sexCounts[sex]) {
        sexCounts[sex] = 0;
      }
      sexCounts[sex]++;
    });

    const result = Object.entries(sexCounts).map(([sex, user_count]) => ({
      sex,
      user_count,
      percentage: total > 0 ? (user_count * 100.0 / total) : 0.0
    }));

    return handleSupabaseSuccess(result, 'Demographics by sex fetched successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Get main concerns from feedback
export const getMainConcerns = async () => {
  try {
    const { data, error } = await supabase
      .from('tbl_feedback')
      .select('feedback_id, main_concern');

    if (error) throw error;

    const concernCounts = {};

    data.forEach(feedback => {
      const concern = feedback.main_concern;
      if (!concernCounts[concern]) {
        concernCounts[concern] = 0;
      }
      concernCounts[concern]++;
    });

    const result = Object.entries(concernCounts)
      .map(([main_concern, concern_count]) => ({
        main_concern,
        concern_count
      }))
      .sort((a, b) => b.concern_count - a.concern_count);

    return handleSupabaseSuccess(result, 'Main concerns fetched successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Get user growth over time (daily)
export const getUserGrowthDaily = async () => {
  try {
    const { data, error } = await supabase
      .from('tbl_users')
      .select('user_id, created_at')
      .order('created_at', { ascending: true });

    if (error) throw error;

    const dailyCounts = {};

    data.forEach(user => {
      const date = user.created_at.substring(0, 10); // YYYY-MM-DD
      if (!dailyCounts[date]) {
        dailyCounts[date] = 0;
      }
      dailyCounts[date]++;
    });

    const result = Object.entries(dailyCounts)
      .map(([registration_date, new_users_count]) => ({
        registration_date,
        new_users_count
      }))
      .sort((a, b) => a.registration_date.localeCompare(b.registration_date));

    return handleSupabaseSuccess(result, 'User growth data fetched successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Get user growth over time (monthly)
export const getUserGrowthMonthly = async () => {
  try {
    const { data, error } = await supabase
      .from('tbl_users')
      .select('user_id, created_at')
      .order('created_at', { ascending: true });

    if (error) throw error;

    const monthlyCounts = {};

    data.forEach(user => {
      const month = user.created_at.substring(0, 7); // YYYY-MM
      if (!monthlyCounts[month]) {
        monthlyCounts[month] = 0;
      }
      monthlyCounts[month]++;
    });

    const result = Object.entries(monthlyCounts)
      .map(([registration_month, new_users_count]) => ({
        registration_month,
        new_users_count
      }))
      .sort((a, b) => a.registration_month.localeCompare(b.registration_month));

    return handleSupabaseSuccess(result, 'User growth data fetched successfully');
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export default {
  getContentMatchAnalytics,
  getContentMatchRate,
  getDemographicsByAge,
  getDemographicsBySex,
  getMainConcerns,
  getUserGrowthDaily,
  getUserGrowthMonthly
};
