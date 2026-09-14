import React, { useState, useRef } from 'react';

// Mock recent scans data
const initialRecentScans = [
  {
    id: 'scan-1',
    merchant: 'Starbucks',
    amount: '₹450',
    category: 'Food & Dining',
    date: '12 Sep 2026',
    thumbnail: '☕',
  },
  {
    id: 'scan-2',
    merchant: 'Amazon',
    amount: '₹1,299',
    category: 'Shopping',
    date: '10 Sep 2026',
    thumbnail: '📦',
  },
  {
    id: 'scan-3',
    merchant: 'Uber',
    amount: '₹320',
    category: 'Transportation',
    date: '08 Sep 2026',
    thumbnail: '🚗',
  },
  {
    id: 'scan-4',
    merchant: 'Zomato',
    amount: '₹620',
    category: 'Food & Dining',
    date: '05 Sep 2026',
    thumbnail: '🍕',
  },
];

function ReceiptScanner({ onBackToDashboard, onAddExpense, onToggleSidebar }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recentScans, setRecentScans] = useState(initialRecentScans);
  const [toastMessage, setToastMessage] = useState('');

  // Editable extracted details
  const [extractedData, setExtractedData] = useState({
    merchant: 'Starbucks',
    date: '12 Sep 2026',
    amount: '450',
    category: 'Food & Dining',
    paymentMethod: 'Credit Card',
  });

  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setHasScanned(false);
    setIsScanning(false);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Remove image
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setHasScanned(false);
    setIsScanning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger simulated scan
  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      // Preset realistic mock data based on file name or defaults
      setExtractedData({
        merchant: selectedFile?.name?.toLowerCase().includes('amazon') ? 'Amazon' : 'Starbucks',
        date: '12 Sep 2026',
        amount: '450',
        category: 'Food & Dining',
        paymentMethod: 'Credit Card',
      });
    }, 1500);
  };

  // Handle mock photo take
  const handleTakePhoto = () => {
    // Create a dummy image canvas preview for camera trigger UI
    const dummyName = 'camera_capture_receipt.jpg';
    const blob = new Blob(['mock receipt data'], { type: 'image/jpeg' });
    const mockFile = new File([blob], dummyName, { type: 'image/jpeg' });
    
    // SVG mock receipt graphic data URL for preview
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect width="400" height="500" fill="#26252e" rx="16"/>
      <rect x="30" y="30" width="340" height="440" fill="#1c1b22" rx="12" stroke="#34d399" stroke-width="2" stroke-dasharray="8,4"/>
      <text x="200" y="90" font-family="sans-serif" font-size="22" font-weight="bold" fill="#f5f5f7" text-anchor="middle">STARBUCKS COFFEE</text>
      <text x="200" y="120" font-family="sans-serif" font-size="14" fill="#8e8d9a" text-anchor="middle">Store #48291 • New Delhi</text>
      <line x1="50" y1="150" x2="350" y2="150" stroke="#31303b" stroke-width="2"/>
      <text x="60" y="190" font-family="sans-serif" font-size="16" fill="#f5f5f7">1x Caffe Latte (Grande)</text>
      <text x="340" y="190" font-family="sans-serif" font-size="16" fill="#f5f5f7" text-anchor="end">₹280.00</text>
      <text x="60" y="230" font-family="sans-serif" font-size="16" fill="#f5f5f7">1x Blueberry Muffin</text>
      <text x="340" y="230" font-family="sans-serif" font-size="16" fill="#f5f5f7" text-anchor="end">₹170.00</text>
      <line x1="50" y1="270" x2="350" y2="270" stroke="#31303b" stroke-width="2"/>
      <text x="60" y="310" font-family="sans-serif" font-size="18" font-weight="bold" fill="#f5f5f7">TOTAL</text>
      <text x="340" y="310" font-family="sans-serif" font-size="20" font-weight="bold" fill="#34d399" text-anchor="end">₹450.00</text>
      <text x="200" y="370" font-family="sans-serif" font-size="13" fill="#8e8d9a" text-anchor="middle">Payment: Credit Card (**** 4892)</text>
      <text x="200" y="400" font-family="sans-serif" font-size="13" fill="#8e8d9a" text-anchor="middle">Date: 12 Sep 2026, 04:15 PM</text>
    </svg>`;

    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
    setSelectedFile({ name: dummyName, size: 842000 });
    setPreviewUrl(dataUrl);
    setHasScanned(false);
    setIsScanning(false);
  };

  // Field change
  const handleInputChange = (field, value) => {
    setExtractedData((prev) => ({ ...prev, [field]: value }));
  };

  // Save Expense
  const handleSaveExpense = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(extractedData.amount.replace(/[^0-9.]/g, '')) || 450;
    
    if (onAddExpense) {
      onAddExpense({
        merchant: extractedData.merchant,
        amount: -numericAmount,
        category: extractedData.category.split(' ')[0] || 'Food',
        date: extractedData.date,
      });
    }

    // Add to local recent scans
    const newScanEntry = {
      id: `scan-${Date.now()}`,
      merchant: extractedData.merchant,
      amount: `₹${numericAmount}`,
      category: extractedData.category,
      date: extractedData.date,
      thumbnail: extractedData.category.includes('Food') ? '☕' : '🧾',
    };

    setRecentScans([newScanEntry, ...recentScans]);
    setToastMessage(`Expense for ${extractedData.merchant} saved successfully!`);

    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Reset to scan another
  const handleScanAnother = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setHasScanned(false);
    setIsScanning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper for size display
  const formatFileSize = (bytes) => {
    if (!bytes) return '1.2 MB';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="receipt-scanner-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="scanner-toast">
          <span className="toast-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header Action */}
      <div className="view-header-bar">
        {onToggleSidebar && (
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            title="Toggle Sidebar Menu"
          >
            ☰
          </button>
        )}
        {onBackToDashboard && (
          <button
            type="button"
            className="btn-primary receipt-back-btn"
            onClick={onBackToDashboard}
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* Page Header */}
      <header className="scanner-header">
        <h1 className="scanner-title">Receipt Scanner</h1>
        <p className="scanner-subtitle">
          Scan your receipts and automatically extract expense details.
        </p>
      </header>

      {/* Main Scanner Card */}
      <div className="scanner-main-card">
        {!selectedFile ? (
          /* Step 1: Upload Dropzone Area */
          <div
            className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              style={{ display: 'none' }}
            />

            <div className="upload-icon-wrapper">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>

            <h2 className="upload-heading">Upload your receipt</h2>
            <p className="upload-description">
              Upload an image of your receipt to extract expense details.
            </p>

            <div className="upload-actions" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginRight: '6px' }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Receipt
              </button>
            </div>

            <p className="upload-hint">PNG, JPG or JPEG • Max 10MB</p>
          </div>
        ) : (
          /* Step 2 & 3: Preview and Loading / Extracted State */
          <div className="preview-and-scan-wrapper">
            <div className="preview-card-header">
              <div className="file-info-badge">
                <span className="file-icon">📄</span>
                <div className="file-details">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>

              <button
                type="button"
                className="remove-file-btn"
                onClick={handleRemoveFile}
                disabled={isScanning}
              >
                ✕ Remove
              </button>
            </div>

            {/* Receipt Preview Container */}
            <div className="receipt-preview-container">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Receipt Preview"
                  className="receipt-preview-image"
                />
              ) : (
                <div className="receipt-placeholder">
                  <span>🧾</span>
                  <p>Receipt Image Selected</p>
                </div>
              )}

              {/* Scanning Overlay Animation */}
              {isScanning && (
                <div className="scanning-overlay">
                  <div className="scan-line"></div>
                  <div className="scanning-spinner"></div>
                  <p className="scanning-text">Scanning receipt...</p>
                </div>
              )}
            </div>

            {/* Action Bar before scanning */}
            {!hasScanned && !isScanning && (
              <div className="preview-action-bar">
                <button
                  type="button"
                  className="btn-primary scan-submit-btn"
                  onClick={handleStartScan}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ marginRight: '8px' }}
                  >
                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                    <rect x="7" y="7" width="10" height="10" rx="1" />
                  </svg>
                  Scan Receipt
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 4: Extracted Information UI */}
      {hasScanned && (
        <div className="extracted-details-section">
          <div className="section-header">
            <h2 className="section-title">Extracted Details</h2>
            <span className="extracted-tag font-medium">Auto-filled • Editable</span>
          </div>

          <form className="extracted-form" onSubmit={handleSaveExpense}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="merchant">Merchant</label>
                <input
                  id="merchant"
                  type="text"
                  value={extractedData.merchant}
                  onChange={(e) => handleInputChange('merchant', e.target.value)}
                  placeholder="e.g. Starbucks"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="text"
                  value={extractedData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  placeholder="e.g. 12 Sep 2026"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Total Amount</label>
                <input
                  id="amount"
                  type="text"
                  value={extractedData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="e.g. ₹450"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={extractedData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  value={extractedData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="UPI / GPay">UPI / GPay</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <div className="extracted-actions">
              <button type="submit" className="btn-primary">
                Save Expense
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleScanAnother}
              >
                Scan Another Receipt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 5: Recent Scans Section */}
      <div className="recent-scans-section">
        <h2 className="section-title">Recent Scans</h2>
        <div className="recent-scans-list">
          {recentScans.map((scan) => (
            <div key={scan.id} className="recent-scan-card">
              <div className="scan-left">
                <div className="scan-thumbnail">{scan.thumbnail}</div>
                <div className="scan-info">
                  <span className="scan-merchant">{scan.merchant}</span>
                  <span className="scan-meta">
                    {scan.category} • {scan.date}
                  </span>
                </div>
              </div>
              <div className="scan-right">
                <span className="scan-amount">{scan.amount}</span>
                <span className="scan-status-badge">Processed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReceiptScanner;
