import { Fragment, useRef, useState, useEffect } from "react"
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
      (!open && !openState && action === "onMouseEnter") ||
      (open && openState && action === "onMouseLeave")
    ) {
      // clear the old timeout, if any
      clearTimeout(timeout)
      // open the modal after a timeout
      timeout = setTimeout(() => toggleMenu(open), timeoutDuration)
    }
    // else: don't click! 😁
  }

  const handleClick = (open) => {
    setOpenState(!open) // toggle open state in React state
    clearTimeout(timeout) // stop the hover timer if it's running
  }

  const LINK_STYLES = classNames(
    "py-5 px-1 w-48",
    "text-base text-gray-900 uppercase font-bold",
    "transition duration-500 ease-in-out",
    "bg-gray-100 hover:text-blue-700 hover:bg-blue-100"
  )
  const handleClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      event.stopPropagation()
    }
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  })
  return (
    <div
      className={classNames(
        "w-full h-full absolute inset-0 pt-8",
        "bg-gradient-to-r md:bg-gradient-to-l",
        "from-yellow-400 via-red-500 to-pink-500"
      )}
    >
      <Popover className="relative mx-auto w-48">
        {({ open }) => (
          <div
            onMouseEnter={() => onHover(open, "onMouseEnter")}
            onMouseLeave={() => onHover(open, "onMouseLeave")}
            className="flex flex-col"
          >
            <Popover.Button ref={buttonRef}>
              <div
                className={classNames(
                  open ? "text-blue-800" : "text-gray-800",
                  "bg-white rounded-md",
                  "border-2 border-black border-solid",
                  "flex justify-center",
                  LINK_STYLES
                )}
                onClick={() => handleClick(open)}
              >
                <span className="uppercase">
                  {menuTitle} ({openState ? "open" : "closed"})
                  <ChevronDownIcon
                    className={classNames(
                      open ? "text-gray-600 translate-y-6" : "text-gray-400",
                      "h-9 w-9 inline-block",
                      "transform transition-all duration-500"
                    )}
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Popover.Button>

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
              <Popover.Panel static className="z-10 w-48 mx-auto">
                <div
                  className={classNames(
                    "relative grid space-y-[2px]",
                    "bg-white border-2 border-gray-300 border-solid",
                    "divide-y-2 rounded-md text-center"
                  )}
                >
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
    </div>
  )
}
