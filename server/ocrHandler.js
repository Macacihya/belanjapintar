/**
 * BACKEND SERVER CODE (Node.js)
 * This file represents the logic that runs on the server/backend environment.
 * It is NOT executed in the browser.
 * 
 * Dependencies required: 
 * - tesseract.js (Node version)
 * - multer (for handling file uploads)
 * - express (server framework)
 */

const Tesseract = require('tesseract.js');

// Regex logic to parse raw text into items
const parseRawTextToItems = (text) => {
    if (!text) return [];

    const lines = text.split('\n');
    const items = lines
      .map(line => line.trim())
      .filter(line => line.length > 2) // Remove short noise
      .map(line => {
        // Server-side Regex to find price at end of line
        const priceMatch = line.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)$/);
        
        let price = 0;
        let name = line;

        if (priceMatch) {
            const priceStr = priceMatch[0];
            const cleanPriceStr = priceStr.replace(/[.,]/g, '');
            price = parseInt(cleanPriceStr, 10);
            name = line.substring(0, line.lastIndexOf(priceStr)).trim();
        }
        
        // Cleanup name
        name = name.replace(/^[-*•>~.\d]+\s+/, '').replace(/^[-*•>~.]/, '').trim();
        
        return {
            item: name,
            category: 'Lainnya', // OCR cannot determine category without AI
            price: price
        };
      })
      .filter(item => item.item.length > 0);
      
    return items;
};

// Controller function for /api/process-receipt
exports.processReceipt = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Run Non-Generative OCR (Tesseract) on the server
        // req.file.buffer contains the image data in memory
        const result = await Tesseract.recognize(
            req.file.buffer,
            'ind', // Indonesian language
            { logger: m => console.log(m) }
        );

        const rawText = result.data.text;
        console.log("OCR Raw Text:", rawText);

        // Perform Parsing Logic on Server
        const parsedItems = parseRawTextToItems(rawText);

        // Return structured JSON
        res.json({ 
            success: true,
            items: parsedItems 
        });

    } catch (error) {
        console.error("Server OCR Error:", error);
        res.status(500).json({ error: 'Failed to process image on server' });
    }
};