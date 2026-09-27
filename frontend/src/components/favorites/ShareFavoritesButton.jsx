import { useEffect, useState } from 'react'

export default function ShareFavoritesButton({
  onShare
}) {
  // True while the share link is being created and copied.
  // Each share request replaces the previous share token,
  // so repeated clicks are blocked until the first one is done.
  const [isSharing, setIsSharing] = useState(false)

  // True for a moment after a successful copy. Shows the
  // confirmation in the button instead of a browser alert.
  const [copied, setCopied] = useState(false)

  // Return to "Jaa lista" about 2 seconds after a successful copy.
  // The cleanup clears the timer if the page is left before that.
  useEffect(() => {
    if (!copied) {
      return
    }

    const timer = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [copied])

  const handleClick = async () => {
    if (isSharing) {
      return
    }

    setIsSharing(true)

    // Reset so that sharing again restarts the 2 second timer.
    setCopied(false)

    try {
      // onShare returns true only when the link was really copied,
      // so a failed share never shows the success text.
      const success = await onShare()

      if (success) {
        setCopied(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSharing(false)
    }
  }

  let label = 'Jaa lista'

  if (isSharing) {
    label = 'Luodaan linkkiä...'
  } else if (copied) {
    label = '✓ Linkki kopioitu'
  }

  // aria-live lets screen readers announce the changing text,
  // since there is no alert popup anymore.
  return (
    <button
      type="button"
      className="share-favorites-button"
      onClick={handleClick}
      disabled={!onShare || isSharing}
      aria-live="polite"
    >
      {label}
    </button>
  )
}