import "./index.css";

interface PaginationComponentProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function PaginationComponent({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationComponentProps) {
    // Show up to 5 page numbers, centered around the current page
    const currentPageIndex = currentPage - 3 > 0 ? currentPage - 3 : 0;

    return (
        <div className="pagination">
            <button
                className="pagination__btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ← Previous
            </button>

            <div className="pagination__info">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(currentPageIndex, currentPageIndex + 5)
                    .map((page) => (
                        <button
                            key={page}
                            className={`pagination__page ${page === currentPage ? "pagination__page--active" : ""}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
            </div>

            <button
                className="pagination__btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next →
            </button>
        </div>
    );
}

export default PaginationComponent;
