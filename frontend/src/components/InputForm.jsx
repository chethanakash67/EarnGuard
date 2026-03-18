import { useState } from 'react'

export default function InputForm({ onSubmit }) {
    const [name, setName] = useState('')
    const [jobType, setJobType] = useState('')
    const [income, setIncome] = useState('')

    const isValid = name.trim() && jobType && income && Number(income) > 0

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isValid) return
        onSubmit({
            name: name.trim(),
            job_type: jobType,
            expected_income: Number(income),
        })
    }

    return (
        <form onSubmit={handleSubmit} className="card" style={{ animation: 'slideUp 0.5s ease' }}>
            <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                    id="name"
                    className="form-input"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="jobType">Job Type</label>
                <select
                    id="jobType"
                    className="form-select"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                >
                    <option value="" disabled>Select your gig type</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Driver">Driver</option>
                    <option value="Freelancer">Freelancer</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="income">Expected Weekly Income</label>
                <div className="form-input-wrapper">
                    <span className="form-input-prefix">₹</span>
                    <input
                        id="income"
                        className="form-input form-input--with-prefix"
                        type="number"
                        placeholder="5000"
                        min="1"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                    />
                </div>
            </div>

            <button type="submit" className="btn btn--primary" disabled={!isValid}>
                Analyze Risk
            </button>
        </form>
    )
}
