import React, { useState } from 'react';
import axios from 'axios';

export default function TrySearch() {
   const [query, setQuery] = useState('');
   const [result, setResult] = useState(null);
   const [allFiles, setAllFiles] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setAllFiles([]);

    try {
      const response = await axios.get(
        `https://express-nodejs-nc12.onrender.com/api/search?q=${encodeURIComponent(query)}`,
        { timeout: 15000 } // 15 second timeout
      );
      setResult(response.data);
      setAllFiles(response.data.all_files || []);
    } catch (error) {
      console.error('Error fetching search:', error);
      let errorMessage = 'Unable to search right now. Please try again.';
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Search is taking longer than expected. Please check your internet connection and try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Search service is temporarily unavailable. Please try again in a few moments.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Search service is not available. Please try again later.';
      } else if (!navigator.onLine) {
        errorMessage = 'You appear to be offline. Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Cloudinary File Search</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search (e.g. a)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{ marginRight: '0.5rem', padding: '8px', fontSize: '16px' }}
          disabled={loading}
        />
        <button 
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{ 
            padding: '8px 16px', 
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '1rem',
          fontSize: '14px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
          <div style={{ marginTop: '1rem' }}>
            <h4>Search Result:</h4>
            <p>
              {result.public_id
                ? `Match found: ${result.public_id}`
                : 'No match found'}
            </p>
            {result.public_id && (() => {
              const file = allFiles.find(f => f.public_id === result.public_id);
              if (!file) return null;
              if (file.url.endsWith('.mp4')) {
                // Add key to force React to reload the video element when the URL changes
                return (
                  <div>
                    <p>
                      <strong>URL:</strong> {file.url}
                    </p>
                    <video key={file.url} width="320" controls>
                      <source src={file.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                );
              }
              return (
                <div>
                  <p>
                    <strong>URL:</strong> {file.url}
                  </p>
                  <img src={file.url} alt={file.public_id} width="200" />
                </div>
              );
            })()}
          </div>
        )}
      

      {allFiles.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h4>All Files in Folder:</h4>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Public ID</th>
                <th>Preview</th>
              </tr>
            </thead>
              <tbody>
                {allFiles.map((file, index) => (
                  <tr key={index}>
                    <td>{file.public_id}</td>
                    <td>
                      {file.url.endsWith('.mp4') ? (
                        <video width="160" controls>
                          <source src={file.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img src={file.url} alt={file.public_id} width="100" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      )}
    </div>
  );

}
