// ==========================================
// ✅ SECURITY UTILITIES - Production Level
// ==========================================

// Dangerous patterns jo SQL Injection, NoSQL Injection, XSS ke liye use hote hain
const DANGEROUS_PATTERNS = [
  /\$\{.*\}/g,           // Template literals injection
  /\$\(/g,               // Command substitution
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,  // XSS Script tags
  /javascript:/gi,        // JavaScript protocol
  /on\w+\s*=/gi,          // Event handlers (onclick=, onload=, etc.)
  /data:text\/html/gi,    // Data URI XSS
  /eval\s*\(/g,           // Eval injection
  /Function\s*\(/g,       // Function constructor
  /document\./g,          // DOM access
  /window\./g,            // Window access
  /localStorage/g,        // LocalStorage access
  /sessionStorage/g,      // SessionStorage access
  /__proto__/g,           // Prototype pollution
  /constructor/g,         // Constructor access
  /\[object/g,            // Object injection
];

// ==========================================
// ✅ INPUT SANITIZATION
// ==========================================
export const sanitizeInput = (input) => {
  if (input === null || input === undefined) {
    return input;
  }

  // String hai toh sanitize karo
  if (typeof input === 'string') {
    let sanitized = input;
    
    // Dangerous patterns remove karo
    DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // HTML entities encode karo
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    // Trim karo
    sanitized = sanitized.trim();

    // Null bytes remove karo
    sanitized = sanitized.replace(/\0/g, '');

    return sanitized;
  }

  // Array hai toh recursive sanitize
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }

  // Object hai toh recursive sanitize
  if (typeof input === 'object') {
    const sanitized = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        // Key bhi sanitize karo (prototype pollution se bachne ke liye)
        const safeKey = String(key).replace(/__proto__|constructor|prototype/gi, '');
        sanitized[safeKey] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }

  return input;
};

// ==========================================
// ✅ FILE VALIDATION
// ==========================================
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB total

export const validateFile = (file, index = 0) => {
  const errors = [];

  // Check if it's actually a File/Blob
  if (!(file instanceof Blob)) {
    errors.push(`File ${index + 1}: Invalid file format`);
    return { valid: false, errors };
  }

  // Size check
  if (file.size === 0) {
    errors.push(`File ${index + 1}: Empty file`);
    return { valid: false, errors };
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File ${index + 1}: Size exceeds 5MB limit`);
    return { valid: false, errors };
  }

  // MIME type check
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    errors.push(`File ${index + 1}: Invalid file type. Allowed: JPG, PNG, WebP, GIF`);
    return { valid: false, errors };
  }

  // Extension check from name
  if (file.name) {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(`File ${index + 1}: Invalid extension "${ext}"`);
      return { valid: false, errors };
    }

    // Double extension check (security risk)
    const parts = file.name.split('.');
    if (parts.length > 2) {
      errors.push(`File ${index + 1}: Multiple extensions not allowed`);
      return { valid: false, errors };
    }
  }

  return { valid: true, errors: [] };
};

export const validateFiles = (files) => {
  if (!files || files.length === 0) {
    return { valid: false, errors: ['At least one image is required'] };
  }

  if (files.length > 10) {
    return { valid: false, errors: ['Maximum 10 images allowed'] };
  }

  // Total size check
  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
  if (totalSize > MAX_TOTAL_SIZE) {
    return { valid: false, errors: ['Total file size exceeds 20MB limit'] };
  }

  // Individual file validation
  const allErrors = [];
  for (let i = 0; i < files.length; i++) {
    const result = validateFile(files[i], i);
    if (!result.valid) {
      allErrors.push(...result.errors);
    }
  }

  if (allErrors.length > 0) {
    return { valid: false, errors: allErrors };
  }

  return { valid: true, errors: [] };
};

// ==========================================
// ✅ SECURITY HEADERS
// ==========================================
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
});

// ==========================================
// ✅ REQUEST SIZE VALIDATION
// ==========================================
export const validateRequestSize = async (request, maxSizeMB = 25) => {
  const contentLength = request.headers.get('content-length');
  
  if (contentLength) {
    const sizeBytes = parseInt(contentLength, 10);
    const maxBytes = maxSizeMB * 1024 * 1024;
    
    if (sizeBytes > maxBytes) {
      return { 
        valid: false, 
        error: `Request size (${(sizeBytes / 1024 / 1024).toFixed(2)}MB) exceeds ${maxSizeMB}MB limit` 
      };
    }
  }
  
  return { valid: true };
};

// ==========================================
// ✅ SECURITY AUDIT LOG
// ==========================================
export const securityLog = (event, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...details,
  };
  
  // Production mein yeh database ya SIEM mein jayega
  // Abhi console pe log kar rahe hain
  if (process.env.NODE_ENV === 'production') {
    console.error('🚨 SECURITY LOG:', JSON.stringify(logEntry));
  } else {
    console.log('🔒 Security Log:', logEntry.event);
  }
};