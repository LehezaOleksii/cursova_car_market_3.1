import React from 'react';

const ChangeEmailSuccess = () => {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card mt-5 shadow" style={{ borderRadius: '20px' }}>
                        <div className="card-header text-center">
                            <h3>Update Account Data Successful</h3>
                        </div>
                        <div className="card-body text-center">
                            <p className="lead">Your account data was updated succesfully!</p>
                            <p>An email has been sent to you with a link to confirm your email address. Please check your inbox and follow the instructions.</p>
                            <p>If you do not see the email, please check your spam or junk folder.</p>
                        </div>
                        <div className="card-footer text-center">
                            <a href="/login" className="btn btn-primary btn-pill" style={{ borderRadius: '25px' }}>Go to Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ChangeEmailSuccess;
