import React, { useState } from 'react'
import BarcodeReader from 'react-barcode-reader'

function ScanBooks() {
  const [scanned, setScanned] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [book, setBook] = useState(null);
  const [fetchError, setFetchError] = useState('');
  let backend_url = process.env.REACT_APP_LIBRARY_BACKEND;

  const handleScan = (data) => {
    fetch(`${backend_url}/api/books/find/${data}`, {
      method: "GET"
    })
      .then((res) => {
        if (!res.ok) throw new Error('Book not found');
        return res.json();
      })
      .then(data => {
        setBook(data);
        setFetchError('');
        setModalOpen(true);
      })
      .catch(err => {
        setBook(null);
        setFetchError('Book not found');
        setModalOpen(true);
      });
  };

  const handleError = (err) => {
    console.error(err);
  };

  const closeModal = () => {
    setModalOpen(false);
    setBook(null);
    setFetchError('');
  };

  return (
    <div>
      <h1>Scan a Book Barcode</h1>
      <BarcodeReader
        onError={handleError}
        onScan={handleScan}
      />
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '350px',
            textAlign: 'center'
          }}>
            {fetchError ? (
              <>
                <h2>Error</h2>
                <p>{fetchError}</p>
              </>
            ) : book ? (
              <div>
                <img
                  src={book.coverImage || '/placeholder-book.png'}
                  alt={book.name}
                  style={{ width: '150px', height: '200px', objectFit: 'cover', marginBottom: '1rem' }}
                  onError={e => { e.target.src = '/placeholder-book.png'; }}
                />
                <h2>{book.name}</h2>
                <p><strong>Author:</strong> {book.author?.name || 'Unknown'}</p>
                <p><strong>Genre:</strong> {book.genre?.replace('_', ' ')}</p>
                <p><strong>Year:</strong> {book.publishedYear}</p>
                <p><strong>Status:</strong> {book.available ? 'Available' : 'Borrowed'}</p>
                <p><strong>Description:</strong> {book.description}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
            <button onClick={closeModal} style={{ marginTop: '1rem' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScanBooks
