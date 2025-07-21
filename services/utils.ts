export const parseJsonFromMarkdown = (text: string): any => {
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = text.match(fenceRegex);
    const jsonStr = match ? match[2].trim() : text.trim();
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON response:", e, "Raw text:", text);
        try {
            // 尝试提取可能的JSON对象
            const openBrace = jsonStr.indexOf('{');
            const closeBrace = jsonStr.lastIndexOf('}');
            if (openBrace !== -1 && closeBrace > openBrace) {
                const potentialJson = jsonStr.substring(openBrace, closeBrace + 1);
                return JSON.parse(potentialJson);
            }
        } catch (lenientError) {
             console.error("Lenient JSON parse also failed:", lenientError);
        }
        
        // 最终尝试清理字符串中的控制字符
        try {
            const cleanedJson = jsonStr.replace(/[\n\r\t]/g, ' ').trim();
            return JSON.parse(cleanedJson);
        } catch (finalError) {
            console.error("All JSON parsing attempts failed:", finalError);
        }
        
        return null;
    }
};