let actionCounter = 0

export const runModelAction = ({
  actionName,
  cwd,
  models = [],
  modulePath,
  ...options
}) => {
  const channel = `action-runner-${actionCounter++}`

  API.createWindow({
    entryPoint: "TerminalOutput",
    show: false,
    // We have to turn these back into command line style flags
    // so that they can be injected into process.argv through webPreferences.additionalArguments
    // when the window is created.
    args: [
      "--action-name",
      actionName,
      "--cwd",
      cwd,
      "--channel",
      channel,
      "--module-path",
      modulePath || "./content/index.mjs",
      "--models",
      models.join(","),
      ...Object.entries(options).map(([key, value]) => `--${key}=${value}`)
    ]
  })
}

export const runCollectionAction = ({
  actionName,
  cwd,
  modulePath,
  ...options
}) => {
  const channel = `action-runner-${actionCounter++}`

  API.createWindow({
    entryPoint: "TerminalOutput",
    show: false,
    // We have to turn these back into command line style flags
    // so that they can be injected into process.argv through webPreferences.additionalArguments
    // when the window is created.
    args: [
      "--action-name",
      actionName,
      "--cwd",
      cwd,
      "--channel",
      channel,
      "--module-path",
      modulePath || "./content/index.mjs",
      ...Object.entries(options).map(([key, value]) => `--${key}=${value}`)
    ]
  })
}
