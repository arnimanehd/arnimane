import {defineConfig} from "sanity"
import {structureTool} from "sanity/structure"
import {visionTool} from "@sanity/vision"
import {schemaTypes} from "./schemaTypes"

export default defineConfig({
  name: "default",
  title: "Arnimane News Studio",
  projectId: "0en3q3ds",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: {types: schemaTypes},
})
