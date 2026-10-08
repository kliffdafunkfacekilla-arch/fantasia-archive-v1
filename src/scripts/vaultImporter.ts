import { saveDocument } from "./databaseManager/documentManager"
import { askAI } from "./aiService"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function importVault (files: File[], vueInstance: any) {
  const options = vueInstance.SGET_options
  if (!options) {
    throw new Error("Settings not loaded")
  }

  for (const file of files) {
    if (file.name.endsWith(".md")) {
      const content = await file.text()
      const prompt = `Analyze this markdown file from an Obsidian vault and convert it into a JSON document suitable for Fantasia Archive.
The file is named: ${file.name}
The contents are:
${content}

Return ONLY valid JSON matching this interface:
{
  "_id": string (unique random uuid),
  "title": string,
  "type": string (choose from: characters, locations, loreNotes, etc.),
  "category": string (optional, usually "Imported"),
  "order": number,
  "connected": [],
  "tags": [],
  "extraFields": [],
  "documentColors": { "color": "none", "backgroundColor": "none" },
  "dateCreated": string (ISO date),
  "dateModified": string (ISO date),
  "editMode": boolean (false),
  "hasEdits": boolean (true),
  "isNew": boolean (true),
  "url": string
}
Do not include any markdown formatting like \`\`\`json in the response, just the raw JSON.`

      try {
        const responseText = await askAI(prompt, options.aiService, options.aiApiKey, options.aiModel)
        const parsedDoc = JSON.parse(responseText.trim().replace(/^```json\n?/, "").replace(/\n?```$/, ""))

        const allOpenedDocuments = vueInstance.SGET_allOpenedDocuments || { docs: [] }
        const allDocuments = vueInstance.SGET_allDocuments ? vueInstance.SGET_allDocuments.docs : []

        await saveDocument(parsedDoc, allOpenedDocuments.docs, allDocuments, false, vueInstance, true)
      }
      catch (err) {
        console.error(`Failed to process ${file.name}`, err)
      }
    }
  }
}
