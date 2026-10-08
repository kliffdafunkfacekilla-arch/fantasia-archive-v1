<template>
  <q-dialog
    v-model="isOpen"
    seamless
    position="right"
    @hide="closePanel"
  >
    <q-card style="width: 400px; max-width: 80vw; max-height: 80vh; display: flex; flex-direction: column;" class="bg-dark text-cultured">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">AI Assistant</div>
        <q-space />
        <q-btn icon="mdi-close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="col" style="overflow-y: auto; flex-grow: 1;">
        <div v-if="loading" class="text-center q-my-md">
          <q-spinner-gears color="primary" size="3em" />
        </div>
        <div v-else class="text-body1 q-pa-sm" style="white-space: pre-wrap;">
          {{ responseText }}
        </div>
      </q-card-section>

      <q-card-section class="bg-dark q-pt-none">
        <q-input
          dark
          filled
          v-model="prompt"
          placeholder="Ask the AI to generate content..."
          type="textarea"
          autogrow
          @keydown.enter.prevent="generateContent"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="mdi-send" @click="generateContent" :disable="loading || !prompt.trim()" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator"
import BaseClass from "src/BaseClass"
import { askAI } from "src/scripts/aiService"
import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"

@Component
export default class AIPanel extends BaseClass {
  isOpen = false
  prompt = ""
  responseText = "How can I help you build your world today?"
  loading = false

  @Watch("SGET_getAiPanelVisible")
  onVisibilityChange (val: string) {
    if (val) {
      this.isOpen = true
    }
  }

  closePanel () {
    this.isOpen = false
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.SSET_setAiPanelVisible() // will reset to new UID or we can just let v-model handle it, but BaseClass requires setting it via mutation
  }

  async generateContent () {
    if (!this.prompt.trim()) {
      return
    }

    this.loading = true
    this.responseText = ""

    const options = this.SGET_options
    const currentDoc = this.findRequestedOrActiveDocument() as I_OpenedDocument | undefined

    let fullPrompt = String(this.prompt)
    if (currentDoc) {
      const docTitle = currentDoc.title ? String(currentDoc.title) : "Unknown"
      const docType = currentDoc.type ? String(currentDoc.type) : "Unknown"
      const promptString = String(this.prompt)
      const dataStr = JSON.stringify(currentDoc, null, 2)
      fullPrompt = `I am working on a document titled "${docTitle}" of type "${docType}". \n` +
      `Here is its current data: ${dataStr}\n\n` +
      `Request: ${promptString}`
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.responseText = await askAI(fullPrompt, options.aiService, options.aiApiKey, options.aiModel)
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        this.responseText = "Error generating content: " + err.message
      }
      else {
        this.responseText = "Error generating content: " + String(err)
      }
    }
    finally {
      this.loading = false
      this.prompt = ""
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
