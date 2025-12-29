import { ParsedItem } from '../types';

/**
 * Uploads an image to the backend server for OCR processing.
 * 
 * DESIGN SPECIFICATION:
 * 1. Client creates FormData with the image file.
 * 2. Client sends POST request to /api/process-receipt.
 * 3. Server receives file, runs Tesseract (OCR), runs Regex parsing.
 * 4. Server returns JSON { items: ParsedItem[] }.
 * 
 * NOTE: In this specific web preview environment, there is no running Node.js backend.
 * Therefore, this service includes a FALLBACK mechanism that simulates a server response
 * so the UI flow can be demonstrated without crashing.
 */
export const parseShoppingListImage = async (imageFile: File): Promise<ParsedItem[]> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    // Attempt to call the backend endpoint
    // In a real app, this URL would point to your actual backend (e.g., Cloud Functions, Express server)
    const response = await fetch('/api/process-receipt', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        if (response.status === 404) {
            console.warn("Backend endpoint not found (Expected in Demo). Using simulation.");
            return simulateServerProcessing();
        }
        throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items;

  } catch (error) {
    console.warn("Network/Server error. Switching to Demo Simulation mode.", error);
    // Fallback to simulation for the purpose of the demo
    return simulateServerProcessing();
  }
};

/**
 * SIMULATED SERVER RESPONSE
 * This function mimics the latency and data structure that the server would return.
 * It does NOT perform real OCR in the browser (adhering to requirements).
 */
const simulateServerProcessing = async (): Promise<ParsedItem[]> => {
    // 1. Simulate Network/Processing Latency (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Return Mock Data (Simulating what the server would have parsed from a receipt)
    // Since we can't run Tesseract on the server in this demo, we return sample data.
    return [
        { item: "Demo: Beras Premium 5kg", category: "Bahan Pokok", price: 65000 },
        { item: "Demo: Minyak Goreng 2L", category: "Bahan Pokok", price: 32000 },
        { item: "Demo: Telur Ayam 1kg", category: "Daging & Ikan", price: 28000 },
        { item: "Demo: Sabun Cuci Cair", category: "Kebersihan", price: 15000 },
        { item: "Demo: Teh Celup Box", category: "Minuman", price: 8500 }
    ];
};
