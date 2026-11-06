import { useState } from "react"
import Button from "./Button.jsx"
import Modal from "./Modal.jsx"
import QuestionmarkSrc from "../sprites/questionmark.webp"
import { useTranslation } from "../hooks/useTranslation.jsx"

function HelpButton({ title, children }) {
    const [isVisible, setIsVisible] = useState(false)
    const help = useTranslation("app.common.help")
    const helpFor = useTranslation("app.common.helpForTooltip", undefined, { title })
    const close = useTranslation("app.shared.close")

    return (
        <>
            <Button
                className="page-help-button"
                prefix={<img src={QuestionmarkSrc} alt="" />}
                text={help}
                title={helpFor}
                color={6}
                onClick={() => setIsVisible(true)}
            />
            <Modal position="center" className="page-help-dialog" isVisible={isVisible} onClose={() => setIsVisible(false)}>
                <section className="page-help-modal flex-col">
                    <div className="page-help-content flex-col">
                        {children}
                    </div>
                    <Button text={close} color={6} onClick={() => setIsVisible(false)} />
                </section>
            </Modal>
        </>
    )
}

export default HelpButton
