import SpreadSheet from "./SpreadSheet.js"

const privates = new WeakMap()

export default class Sheets {
  constructor(collection, opts = {}) {
    const { serviceAccount, ...options } = opts

    privates.set(this, {
      collection,
      options,
      serviceAccount,
      registry: new Map()
    })
  }

  get collection() {
    return privates.get(this).collection
  }

  get options() {
    return privates.get(this).options
  }

  get registry() {
    return privates.get(this).registry
  }

  get available() {
    return Array.from(this.registry.keys())
  }

  async sheet(name, options = {}) {
    if (arguments.length === 1) {
      if (!this.registry.has(name)) {
        throw new Error(`Sheet ${name} not found. You must create it first`)
      } else {
        return this.registry.get(name)
      }
    }

    const { sheetId } = options

    const spreadsheet = new SpreadSheet({
      sheetId,
      serviceAccount: privates.get(this).serviceAccount,
      ...options
    })

    this.registry.set(name, spreadsheet)

    return spreadsheet.initialize()
  }
}
