import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/auth/forgot-password/send-otp', { email }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 204) {
                setError('User with this email does not exist.');
            }
            if (response.status === 200) {
                setError('');
                navigate('/forgot-password-otp', { state: { email } });
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card mt-5" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <div className="card-header text-center">
                            <h3>Forgot Password</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleForgotPassword}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        style={{ borderRadius: '10px' }}
                                    />
                                </div>
                                <div className="d-grid mb-2">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Confirm'}
                                    </button>
                                </div>
                            </form>
                            {error && <p className="text-danger">{error}</p>}
                        </div>
                        <div className="card-footer text-center">
                            <small className="text-muted">Remembered your password? <a href="/login">Login</a></small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
