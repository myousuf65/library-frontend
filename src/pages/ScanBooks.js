import React, { useState } from 'react'
import BarcodeReader from 'react-barcode-reader'

function ScanBooks() {
  const [scannedBooks, setScannedBooks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  
  let backend_url = process.env.REACT_APP_LIBRARY_BACKEND;

  const handleScan = (data) => {
    // Check if book is already scanned
    console.log(data);
    const alreadyScanned = scannedBooks.some(book => book.barcode === data);
    if (alreadyScanned) {
      setCurrentBook(null);
      setFetchError('Book already scanned');
      setModalOpen(true);
      return;
    }

    fetch(`${backend_url}/api/books/find/${data}`, {
      method: "GET"
    })
      .then((res) => {
        if (!res.ok) throw new Error('Book not found');
        return res.json();
      })
      .then(bookData => {
        const bookWithBarcode = { ...bookData, barcode: data };
        setCurrentBook(bookWithBarcode);
        setFetchError('');
        setModalOpen(true);
      })
      .catch(err => {
        setCurrentBook(null);
        setFetchError('Book not found');
        setModalOpen(true);
      });
  };

  const handleError = (err) => {
    console.error(err);
  };

  const addBookToList = () => {
    if (currentBook) {
      setScannedBooks(prev => [...prev, currentBook]);
      closeModal();
    }
  };

  const removeBook = (barcode) => {
    setScannedBooks(prev => prev.filter(book => book.barcode !== barcode));
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentBook(null);
    setFetchError('');
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };

  const clearAllBooks = () => {
    setScannedBooks([]);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Scan Book Barcodes</h1>
        <div style={{ marginBottom: '1rem' }}>
          <button 
            onClick={toggleScanning}
            style={{ 
              padding: '0.5rem 1rem', 
              marginRight: '1rem',
              backgroundColor: isScanning ? '#dc3545' : '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isScanning ? 'Stop Scanning' : 'Start Scanning'}
          </button>
          {scannedBooks.length > 0 && (
            <button 
              onClick={clearAllBooks}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear All ({scannedBooks.length})
            </button>
          )}
        </div>
        
        {isScanning && (
          <div style={{ 
            border: '2px dashed #ccc', 
            padding: '2rem', 
            textAlign: 'center',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <BarcodeReader
              onError={handleError}
              onScan={handleScan}
            />
            <p style={{ marginTop: '1rem', color: '#666' }}>
                Scan a Book 
            </p>
          </div>
        )}
      </div>

      {/* Scanned Books List */}
      {scannedBooks.length > 0 && (
        <div>
          <h2>Scanned Books ({scannedBooks.length})</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1rem',
            marginTop: '1rem'
          }}>
            {scannedBooks.map((book, index) => (
              <div key={book.barcode} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <img
                    src={book.coverImage || '/placeholder-book.png'}
                    alt={book.name}
                    style={{ 
                      width: '80px', 
                      height: '100px', 
                      objectFit: 'cover',
                      borderRadius: '4px',
                      flexShrink: 0
                    }}
                    onError={e => { e.target.src = '/placeholder-book.png'; }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                      {book.name}
                    </h3>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Author:</strong> {book.author?.name || 'Unknown'}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Year:</strong> {book.publishedYear}
                    </p>
                    {/* <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Status:</strong> 
                      <span style={{ 
                        color: book.available ? '#28a745' : '#dc3545',
                        fontWeight: 'bold'
                      }}>
                        {book.available ? ' Available' : ' Borrowed'}
                      </span>
                    </p> */}
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#666' }}>
                      Barcode: {book.barcode}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => removeBook(book.barcode)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    width: '100%'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
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
            maxWidth: '90vw',
            textAlign: 'center',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            {fetchError ? (
              <>
                <h2 style={{ color: '#dc3545' }}>
                  {fetchError === 'Book already scanned' ? 'Already Scanned' : 'Error'}
                </h2>
                <p>{fetchError}</p>
                <button onClick={closeModal} style={{ 
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Close
                </button>
              </>
            ) : currentBook ? (
              <div>
                <img
                  src={currentBook.coverImage || '/placeholder-book.png'}
                  alt={currentBook.name}
                  style={{ 
                    width: '150px', 
                    height: '200px', 
                    objectFit: 'cover', 
                    marginBottom: '1rem',
                    borderRadius: '4px'
                  }}
                  onError={e => { e.target.src = '/placeholder-book.png'; }}
                />
                <h2>{currentBook.name}</h2>
                <p><strong>Author:</strong> {currentBook.author?.name || 'Unknown'}</p>
                <p><strong>Genre:</strong> {currentBook.genre?.replace('_', ' ')}</p>
                <p><strong>Year:</strong> {currentBook.publishedYear}</p>
                {/* <p><strong>Status:</strong> 
                  <span style={{ 
                    color: currentBook.available ? '#28a745' : '#dc3545',
                    fontWeight: 'bold'
                  }}>
                    {currentBook.available ? ' Available' : ' Borrowed'}
                  </span>
                </p> */}
                {currentBook.description && (
                  <p><strong>Description:</strong> {currentBook.description}</p>
                )}
                <div style={{ marginTop: '1.5rem' }}>
                  <button 
                    onClick={addBookToList}
                    style={{ 
                      marginRight: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Add to List
                  </button>
                  <button 
                    onClick={closeModal}
                    style={{ 
                      padding: '0.5rem 1rem',
                      backgroundColor: '#6c757d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ScanBooks