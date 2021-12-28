import { contextBridge } from "electron"
import * as APIClient from "./api/client.js"

contextBridge.exposeInMainWorld("API", {
  ...APIClient
})
