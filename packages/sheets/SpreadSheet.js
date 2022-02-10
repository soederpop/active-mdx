import gs from "google-spreadsheet"
import { kebabCase, camelCase, pickBy } from "lodash-es"

const { GoogleSpreadsheet } = gs

export class SpreadSheet {
  static async create(sheetId, options = {}) {
    const s = new SpreadSheet({ ...options, sheetId })

    await s.initialize()

    return s
  }

  constructor(options = {}) {
    this._options = options

    if (typeof options.sheetId !== "string") {
      throw new Error(
        `Must specify a sheetId property in the initialization options.`
      )
    }

    if (typeof options.serviceAccount !== "object") {
      throw new Error(
        `Must specify a serviceAccount property in the initialization options.`
      )
    }

    if (typeof options.serviceAccount.private_key !== "string") {
      throw new Error(
        `The serviceAccount object must contain a private key.  Use the service account JSON downloaded from google`
      )
    }

    Object.defineProperty(this, "_options", {
      enumerable: false,
      value: options
    })

    Object.defineProperty(this, "_data", {
      enumerable: false,
      value: options.data || {}
    })
  }

  async initialize() {
    const { googleDocument: s } = this
    await s.useServiceAccountAuth(this.options.serviceAccount)
    await s.loadInfo()
    await this.loadAllWorksheets()
  }

  async loadAllWorksheets() {
    const entries = Object.entries(this.googleDocument.sheetsByTitle)

    await Promise.all(
      entries.map(([sheetTitle, worksheet]) =>
        worksheet.getRows().then((rows) => {
          this.data[camelCase(kebabCase(sheetTitle))] = rows.map((row) => ({
            ...pickBy(row, (v, k) => !k.startsWith("_")),
            get _row() {
              return row
            }
          }))
        })
      )
    )
  }

  get data() {
    return this._data
  }

  worksheet(nameOrIndex) {
    const { googleDocument: gs } = this

    if (typeof nameOrIndex === "number") {
      return gs.sheetsByIndex[nameOrIndex]
    }

    if (gs.sheetsByTitle[nameOrIndex]) {
      return gs.sheetsByTitle[nameOrIndex]
    }

    return this.allSheets.find(
      (sheet) =>
        String(sheet._rawProperties.title).toLowerCase() ===
        nameOrIndex.toLowerCase()
    )
  }

  get allSheets() {
    return Object.values(this.googleDocument.sheetsByIndex)
  }

  get worksheetTitles() {
    return Object.keys(this.googleDocument.sheetsByTitle)
  }

  get options() {
    return this._options
  }

  get googleSpreadsheetId() {
    return this.options.sheetId
  }

  get googleDocument() {
    if (this._googleSheet) {
      return this._googleSheet
    }

    const gs = new GoogleSpreadsheet(this.googleSpreadsheetId)
    Object.defineProperty(this, "_googleSheet", {
      enumerable: false,
      value: gs
    })

    return gs
  }
}

export default SpreadSheet
