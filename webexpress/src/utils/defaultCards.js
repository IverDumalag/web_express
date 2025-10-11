// Utility function to add default cards for new users
const INSERT_API_URL = import.meta.env.VITE_PHRASESWORDSINSERT;
const TRYSEARCH_API_URL = import.meta.env.VITE_TRYSEARCH;
const CARDS_API_URL = import.meta.env.VITE_PHRASESWORDSBYIDGET;

/**
 * Adds a single card to the user's collection
 * @param {string} userId - The user's ID
 * @param {string} word - The word/phrase to add
 * @returns {Promise<Object>} - Result object with success status and message
 */
async function addSingleCard(userId, word) {
  try {
    let sign_language_url = "";
    let is_match = 0;

    // Search for sign language match
    try {
      const searchRes = await fetch(`${TRYSEARCH_API_URL}?q=${encodeURIComponent(word)}`, {
        timeout: 15000
      });

      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        if (searchJson?.public_id && Array.isArray(searchJson.all_files)) {
          const file = searchJson.all_files.find(f => f.public_id === searchJson.public_id);
          if (file) {
            sign_language_url = file.url;
            is_match = 1;
          }
        }
      }
    } catch (searchError) {
      console.warn(`Search service unavailable for "${word}", proceeding without sign language match`);
    }

    // Add to user's collection
    const insertRes = await fetch(INSERT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        user_id: userId, 
        words: word, 
        sign_language: sign_language_url, 
        is_match 
      }),
      timeout: 15000
    });

    if (!insertRes.ok) {
      throw new Error(`HTTP ${insertRes.status}: ${insertRes.statusText}`);
    }

    const insertJson = await insertRes.json();
    if (insertJson.status === 201 || insertJson.status === "201") {
      return {
        success: true,
        message: `Successfully added "${word}"`,
        hasSignLanguage: is_match === 1
      };
    } else {
      return {
        success: false,
        message: insertJson.message || `Failed to add "${word}"`
      };
    }
  } catch (error) {
    console.error(`Error adding card "${word}":`, error);
    return {
      success: false,
      message: `Failed to add "${word}": ${error.message}`
    };
  }
}

/**
 * Checks if user already has cards in their collection
 * @param {string} userId - The user's ID
 * @returns {Promise<boolean>} - True if user has cards, false otherwise
 */
async function userHasCards(userId) {
  try {
    const res = await fetch(`${CARDS_API_URL}?user_id=${encodeURIComponent(userId)}`, {
      timeout: 10000
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const json = await res.json();
    const cards = Array.isArray(json.data) ? json.data : [];
    return cards.length > 0;
  } catch (error) {
    console.error('Error checking user cards:', error);
    // If we can't check, assume they have cards to avoid duplicates
    return true;
  }
}

/**
 * Adds default cards (Hello and Good Morning) for new users
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} - Result object with success status and details
 */
export async function addDefaultCards(userId) {
  if (!userId) {
    return {
      success: false,
      message: "User ID is required"
    };
  }

  try {
    // Check if user already has cards
    const hasCards = await userHasCards(userId);
    if (hasCards) {
      return {
        success: true,
        message: "User already has cards, skipping default cards",
        skipped: true
      };
    }

    const defaultWords = ["Hello", "Good Morning"];
    const results = [];

    // Add each default card
    for (const word of defaultWords) {
      const result = await addSingleCard(userId, word);
      results.push({
        word,
        ...result
      });
    }

    const successCount = results.filter(r => r.success).length;
    const signLanguageCount = results.filter(r => r.success && r.hasSignLanguage).length;

    if (successCount === defaultWords.length) {
      return {
        success: true,
        message: `Successfully added ${successCount} default cards`,
        results,
        signLanguageMatches: signLanguageCount
      };
    } else if (successCount > 0) {
      return {
        success: true,
        message: `Added ${successCount} out of ${defaultWords.length} default cards`,
        results,
        signLanguageMatches: signLanguageCount,
        partial: true
      };
    } else {
      return {
        success: false,
        message: "Failed to add any default cards",
        results
      };
    }
  } catch (error) {
    console.error('Error in addDefaultCards:', error);
    return {
      success: false,
      message: `Error adding default cards: ${error.message}`
    };
  }
}