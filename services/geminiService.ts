import { GoogleGenAI, Modality, Part, GenerateContentResponse } from "@google/genai";
import { ImageFile } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateImage(
  productImage: ImageFile,
  prompt: string,
  styleImage: ImageFile | null
): Promise<ImageFile> {
  const model = 'gemini-2.5-flash-image-preview';

  const parts: Part[] = [
    {
      inlineData: {
        data: productImage.base64,
        mimeType: productImage.mimeType,
      },
    },
    { text: prompt },
  ];

  if (styleImage) {
    parts.push({
      inlineData: {
        data: styleImage.base64,
        mimeType: styleImage.mimeType,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
          name: 'generated-image.png',
        };
      }
    }
    
    // Check for safety ratings or blocks if no image is returned
    const safetyText = response.candidates?.[0]?.finishReason;
    if (safetyText) {
        throw new Error(`فشل توليد الصورة بسبب إعدادات الأمان: ${safetyText}`);
    }

    throw new Error('لم يتم توليد أي صورة بواسطة النموذج.');

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('فشل توليد الصورة. يرجى التحقق من الموجه أو مفتاح API.');
  }
}

export async function analyzeStyleImage(styleImage: ImageFile): Promise<string> {
  const model = 'gemini-2.5-flash';
  
  const imagePart = {
    inlineData: {
      data: styleImage.base64,
      mimeType: styleImage.mimeType,
    },
  };
  
  const textPart = {
    text: "قم بتحليل هذه الصورة وصف جمالياتها، ولوحة ألوانها، ومزاجها بعبارة موجزة مناسبة لموجه صورة. مثال: 'نمط حيوي عالي التباين بألوان نيون جريئة ومزاج مستقبلي'.",
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
    });
    
    if(!response.text) {
      // Check for safety ratings or blocks if no text is returned
      const safetyText = response.candidates?.[0]?.finishReason;
      if (safetyText && safetyText !== 'STOP') {
          throw new Error(`فشل تحليل النمط بسبب إعدادات الأمان: ${safetyText}`);
      }
      throw new Error('لم يرجع النموذج أي نص لتحليل النمط.');
    }
    
    return response.text.trim();

  } catch (error) {
    console.error('Error analyzing style image:', error);
    throw new Error('فشل تحليل صورة النمط.');
  }
}