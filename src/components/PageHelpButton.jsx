import { useState } from "react"
import Button from "./Button.jsx"
import Modal from "./Modal.jsx"
import QuestionmarkSrc from "../sprites/questionmark.webp"

function PageHelpButton({ title, children }) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <>
            <Button
                className="page-help-button"
                prefix={<img src={QuestionmarkSrc} alt="" />}
                text="Help"
                title={`Help for ${title}`}
                color={6}
                onClick={() => setIsVisible(true)}
            />
            <Modal position="center" className="page-help-dialog" isVisible={isVisible} onClose={() => setIsVisible(false)}>
                <section className="page-help-modal flex-col">
                    <div className="header-big">{title} Guide</div>
                    <div className="page-help-content flex-col">
                        {children}
                    </div>
                    <Button text="Close" color={6} onClick={() => setIsVisible(false)} />
                </section>
            </Modal>
        </>
    )
}

export default PageHelpButton
