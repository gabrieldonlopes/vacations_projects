import React from "react";

const BookPreview = ({ book }) => {
    return (
        <div className="book-preview">
            <img src={book.volumeInfo_imageLinks_thumbnail} alt={book.volumeInfo_title} />
            <div className="book-info">
                <h2>{book.volumeInfo_title}</h2>
                <p>{book.volumeInfo_authors}</p>
                <p>{book.volumeInfo_pageCount}</p>
            </div>
            <p>{book.id}</p>
            <p>{book.volumeInfor_language}</p>
        </div>
    );
};  

export default BookPreview;