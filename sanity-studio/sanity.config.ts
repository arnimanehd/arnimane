import {defineConfig} from "sanity"
import {structureTool} from "sanity/structure"
import {visionTool} from "@sanity/vision"
import {schemaTypes} from "./schemaTypes"

export default defineConfig({
  name: "default",
  title: "Arnimane News Studio",
  projectId: "PASTE_YOUR_SANITY_PROJECT_ID",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: {types: schemaTypes},
})
