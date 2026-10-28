import { useEffect, useState } from "react"
import Button from "./Button.jsx"

function BackToTopButton({ scrollRef }) {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const element = scrollRef?.current
        if (!element) { setVisible(false); return }
        const updateVisibility = () => setVisible(element.scrollTop > 120)
        updateVisibility()
        element.addEventListener("scroll", updateVisibility, { passive: true })
        return () => element.removeEventListener("scroll", updateVisibility)
    }, [scrollRef])
    if (!visible) return null
    return <Button className="back-to-top-button" prefix="↑" text="Back to top" title="Scroll this list back to the top" color={5} onClick={() => scrollRef?.current?.scrollTo({ top: 0, behavior: "smooth" })} />
}
export default BackToTopButton
