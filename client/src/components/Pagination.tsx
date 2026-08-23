type PaginationProps = {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
};

function Pagination({
                        page,
                        totalPages,
                        onPrevious,
                        onNext,
                    }: PaginationProps) {
    if (totalPages === 0) {
        return null;
    }

    return (
        <div className="pagination">
            <button
                onClick={onPrevious}
                disabled={page === 0}
            >
                Previous
            </button>

            <span>
                Page {page + 1} of {totalPages}
            </span>

            <button
                onClick={onNext}
                disabled={page === totalPages - 1}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;