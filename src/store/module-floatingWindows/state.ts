export interface FloatingWindowsStateInteface {
  advSearchWindowVisible: string,
  noteCorkboardWindowVisible: string,
  documentPreviewVisible: string,
  documentPreviewWindowID: string,
  aiPanelVisible: string
}

function state (): FloatingWindowsStateInteface {
  return {
    advSearchWindowVisible: "",
    noteCorkboardWindowVisible: "",
    documentPreviewVisible: "",
    documentPreviewWindowID: "",
    aiPanelVisible: ""
  }
}

export default state
