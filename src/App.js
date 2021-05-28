import { Fragment, useRef, useState } from "react"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/solid"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function FlyoutMenu({
  menuTitle = "Hover Popover",
  linksArray = [
    // [[title: string, href: string], ...]
    ["Home", "/"],
    ["About", "/about"],
    ["Blog", "/blog"]
  ]
}) {
  let timeout // NodeJS.Timeout
  const timeoutDuration = 400

  const buttonRef = useRef(null) // useRef<HTMLButtonElement>(null)
  const [openState, setOpenState] = useState(false)

  const toggleMenu = (open) => {
    // log the current open state in React (toggle open state)
    setOpenState((openState) => !openState)
    // toggle the menu by clicking on buttonRef
    buttonRef?.current?.click() // eslint-disable-line
  }

  // Open the menu after a delay of timeoutDuration
  const onHover = (open, action) => {
    // if the modal is currently closed, we need to open it
    // OR
    // if the modal is currently open, we need to close it
    if (
      (!open && action === "onMouseEnter") ||
      (open && action === "onMouseLeave")
    ) {
      // clear the old timeout, if any
      clearTimeout(timeout)
      // open the modal after a timeout
      timeout = setTimeout(() => toggleMenu(open), timeoutDuration)
    }
    // else: don't click! 😁
  }

  const LINK_STYLES =
    "py-5 px-1 w-64 text-base text-gray-900 uppercase transition duration-500 ease-in-out hover:text-blue-800 hover:bg-blue-100 font-bold"

  return (
    <>
      <Popover className="relative mx-auto mt-1 w-64">
        {({ open }) => (
          <div
            onMouseEnter={() => onHover(open, "onMouseEnter")}
            onMouseLeave={() => onHover(open, "onMouseLeave")}
          >
            <div className="mx-auto">
              <Popover.Button ref={buttonRef}>
                <div
                  className={classNames(
                    open ? "text-blue-800" : "text-gray-800",
                    "bg-white rounded-md items-center mx-auto border-2 border-black border-solid flex justify-center",
                    LINK_STYLES
                  )}
                  onClick={() => {
                    setOpenState(!open) // toggle open state in React state
                    clearTimeout(timeout) // stop the hover timer if it's running
                  }}
                >
                  <span className="uppercase">
                    {menuTitle} ({openState ? "open" : "closed"})
                  </span>
                  <ChevronDownIcon
                    className={classNames(
                      open ? "text-gray-600 translate-y-1.5" : "text-gray-400",
                      "ml-2 h-5 w-5 transform transition-all"
                    )}
                    aria-hidden="true"
                  />
                </div>
              </Popover.Button>
            </div>

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel static className="z-10 w-64 mx-auto">
                <div className="relative grid space-y-[2px] bg-white border-2 border-gray-300 border-solid divide-y-2 rounded-md text-center">
                  {linksArray.map(([title, href]) => (
                    <Fragment key={"PopoverPanel<>" + title + href}>
                      <a href={href} className={LINK_STYLES}>
                        {title}
                      </a>
                    </Fragment>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </div>
        )}
      </Popover>
    </>
  )
}
