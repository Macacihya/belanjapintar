
import { GoogleGenAI, Type } from "@google/genai";
import { ParsedItem } from "../types";

// Analyze shopping list image using Gemini Vision capabilities
export const parseShoppingListImage = async (base64Image: string): Promise<ParsedItem[]> => {
  // Initialize AI client right before use as recommended for dynamic API key contexts
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Use gemini-3-flash-preview for general vision/OCR-like tasks as per guidelines
    const modelId = "gemini-3-flash-preview"; 
    
    // Clean base64 string if it contains metadata header
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const prompt = `
      Analisis gambar ini yang berisi daftar belanja atau struk belanja.
      Ekstrak setiap barang belanjaan.
      1. Nama Barang: Tulis dengan jelas dalam Bahasa Indonesia.
      2. Kategori: Pilih yang paling sesuai ('Sayuran & Buah', 'Daging & Ikan', 'Bahan Pokok', 'Snack', 'Minuman', 'Kebersihan', 'Lainnya').
      3. Harga: Jika gambar adalah struk yang ada harganya, ambil harganya (hanya angka). Jika hanya daftar tulisan tangan tanpa harga, isi 0.
      
      Kembalikan hanya JSON array yang valid.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              category: { type: Type.STRING },
              price: { type: Type.NUMBER, description: "Harga barang dalam angka, 0 jika tidak ada" }
            },
            required: ["item", "category"]
          }
        }
      }
    });

    // Extracting text from response using the .text property as per guidelines
    const text = response.text;
    if (!text) return [];

    const data = JSON.parse(text) as ParsedItem[];
    return data;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Gagal menganalisis gambar. Coba lagi.");
  }
};
