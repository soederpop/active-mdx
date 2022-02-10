import runtime from "@skypager/node"
import docs from "../../software-project-demo-site/docs/index.mjs"
import sheets from "../index.js"

async function main() {
  const serviceAccount = await runtime.fsx.readJsonAsync(
    runtime.resolve("secrets", "serviceAccount.json")
  )

  await docs
    .use(sheets, {
      serviceAccount,
      sheets: {
        example: {
          sheetId: "14A3bW57s7QLl6zQXw4-lre9gpQvSzVsq9tzYyf9g9Zo",
          sheets: {
            Epics: {
              id: "id",
              title: "title",
              description: "description",
              status: "meta.status",
              "high estimate": "totalEstimates.high",
              "low estimate": "totalEstimates.low"
            },
            Stories: {
              id: "id",
              title: "title",
              status: "status",
              epic: "meta.epic",
              "low estimate": "meta.estimates.low",
              "high estimate": "meta.estimates.high",
              "github issue": "meta.github.issue"
            }
          }
        }
      }
    })
    .load()

  const ctx = {}

  Array.from(docs.models.entries()).forEach(([key, model]) => {
    ctx[key] = model.ModelClass
  })

  await runtime.repl("interactive").launch({
    runtime,
    docs,
    s: await docs.sheets.sheet("example"),
    ...ctx
  })
}

main()
