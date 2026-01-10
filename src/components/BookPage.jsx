
import React, { forwardRef } from 'react';
import './BookPage.css'; // We'll create this CSS file next

const BookPage = forwardRef(({ children, number, title, className }, ref) => {
    return (
        <div className={`book-page ${className || ''}`} ref={ref}>
            <div className="page-content">
                {title && <h2 className="page-header">{title}</h2>}
                <div className="page-body">
                    {children}
                </div>
                <div className="page-footer">
                    <span className="page-number">{number}</span>
                </div>
            </div>
        </div>
    );
});

export default BookPage;
