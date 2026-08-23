import type { ChangeEvent } from "react";

type ProductControlsProps = {
    search: string;
    sort: string;
    onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSortChange: (value: string) => void;
};

function ProductControls({
                             search,
                             sort,
                             onSearchChange,
                             onSortChange,
                         }: ProductControlsProps) {
    return (
        <div className="product-controls">
            <input
                className="search-input"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={onSearchChange}
            />

            <select
                className="sort-select"
                value={sort}
                onChange={(event) => onSortChange(event.target.value)}
            >
                <option value="NEWEST">Newest</option>
                <option value="NAME_ASC">Name: A to Z</option>
                <option value="NAME_DESC">Name: Z to A</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
            </select>
        </div>
    );
}

export default ProductControls;