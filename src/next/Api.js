export default function NextApi(collection) {
  return async function handler(req, res) {
    const path = req.query.catchAll.join("/")
    const controller = path.split("/")[0]
    const action = path.replace(controller, "/").replace(/^\//g, "")

    const options = {
      collection,
      req,
      res,
      path,
      action,
      method: req.method
    }

    switch (controller) {
      case "collection":
        await handleCollection(options)
        break
      default:
        res.status(404).send("Not Found")
    }
  }
}

async function handleCollection({
  collection,
  req,
  res,
  action,
  method,
  path
}) {
  res.status(200).json({
    action,
    method,
    path
  })

  return
}
