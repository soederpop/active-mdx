import React, { useState } from "react"
import { XIcon } from "@heroicons/react/outline"
import { Dialog } from "@headlessui/react"
import ErrorList from "./ErrorList"

export default function NewDocument({ model, onSubmit, onClose }) {
  const [title, setTitle] = useState("")
  const [prefix, setPrefix] = useState(model.prefix)
  const [errorMessage, setErrorMessage] = useState()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ title })
          .then(() => {
            onClose()
          })
          .catch((e) => setErrorMessage(e.message))
      }}
      className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
    >
      <div className="flex-1 h-0 overflow-y-auto">
        <div className="py-6 px-4 bg-indigo-700 sm:px-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-medium text-white">
              New {model.name}
            </Dialog.Title>
            <div className="ml-3 h-7 flex items-center">
              <button
                type="button"
                className="bg-indigo-700 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => onClose()}
              >
                <span className="sr-only">Close panel</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="mt-1">
            <p className="text-sm text-indigo-300">
              Get started by filling in the information below to create your new{" "}
              {model.name}
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          {errorMessage && <ErrorList messages={[errorMessage]} />}
          <div className="px-4 divide-y divide-gray-200 sm:px-6">
            <div className="space-y-6 pt-6 pb-5">
              <div>
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="project-name"
                    id="project-name"
                    value={title}
                    placeholder="Enter a title for the document"
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="prefix"
                  className="block text-sm font-medium text-gray-900"
                >
                  Prefix
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="prefix"
                    id="prefix"
                    value={prefix}
                    placeholder="Enter a title for the document"
                    onChange={(e) => setPrefix(e.target.value)}
                    className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 px-4 py-4 flex justify-end">
        <button
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => onClose()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  )
}
