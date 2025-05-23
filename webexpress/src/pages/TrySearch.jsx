import React, { useState } from 'react';
import axios from 'axios';

export default function TrySearch() {
   const [query, setQuery] = useState('');
   const [result, setResult] = useState(null);
   const [allFiles, setAllFiles] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await axios.get(`https://express-nodejs-nc12.onrender.com/api/search?q=${encodeURIComponent(query)}`);
      setResult(response.data);
      setAllFiles(response.data.all_files || []);
    } catch (error) {
      console.error('Error fetching search:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Cloudinary File Search</h2>
      <input
        type="text"
        placeholder="Search (e.g. a)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginRight: '0.5rem' }}
      />
      <button onClick={handleSearch}>Search</button>

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
