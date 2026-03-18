import { ShieldIcon } from './Icons'

export default function LoadingScreen() {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <span className="loading-shield"><ShieldIcon size={64} /></span>
                <p className="loading-text">Analyzing risk factors</p>
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    )
}
