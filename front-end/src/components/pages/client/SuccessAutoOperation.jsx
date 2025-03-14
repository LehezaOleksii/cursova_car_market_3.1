import React from 'react';

const SuccessAutoOperation = () => {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card mt-5 shadow" style={{ borderRadius: '20px' }}>
                        <div className="card-header text-center">
                            <h3>Auto was added Successful</h3>
                        </div>
                        <div className="card-body text-center">
                            <p className="lead">Your car has been submitted for moderation by our team</p>
                            <p>Once the moderation is complete, you will receive an email with the status of your car listing.</p>
                            <p>If you have any questions or concerns, feel free to reach out to us!</p>
                        </div>
                        <div className="card-footer text-center">
                            <a href="/dashboard" className="btn btn-primary btn-pill" style={{ borderRadius: '25px' }}>Go to dashboard</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SuccessAutoOperation;
