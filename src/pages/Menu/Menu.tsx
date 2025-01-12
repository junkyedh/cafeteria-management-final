import React, { useEffect, useState } from 'react';
import { Button, Input, Card } from 'antd';
import './Menu.scss';

const categories = ['All', 'Cà Phê', 'Trà', 'Trà Sữa', 'Nước Ép', 'Bánh'];

interface Product {
    id: string;
    name: string;
    category: string;
    imageurl: string;
    available: boolean;
    price: number;
    upsize: number;
    sizes: boolean; // true nếu có size S
    sizem: boolean; // true nếu có size M
    sizel: boolean; // true nếu có size L
    hot: boolean;
    cold: boolean;
}

const products: Product[] = [
    {
        id: '1',
        name: 'Cà Phê Sữa',
        category: 'Cà Phê',
        imageurl: "https://res.cloudinary.com/dkntmdcja/image/upload/v1736443313/doan/ualklwc8270sccaqevi3.jpg",
        available: true,
        price: 30,
        upsize: 5,
        sizes: true,
        sizem: true,
        sizel: true,
        hot: true,
        cold: false,
    },
    {
        id: '2',
        name: 'Trà Sữa Trân Châu',
        category: 'Trà Sữa',
        imageurl: "https://res.cloudinary.com/dkntmdcja/image/upload/v1736604707/doan/qrryu4h4dgfqcbgzs9mp.jpg",
        available: true,
        price: 25,
        upsize: 4,
        sizes: true,
        sizem: true,
        sizel: true,
        hot: false,
        cold: true,
    },
    {
        id: '3',
        name: 'Nước Ép Dưa Hấu',
        category: 'Nước Ép',
        imageurl: "https://res.cloudinary.com/dkntmdcja/image/upload/v1736606120/doan/uziwyhj05jyybevosyk7.jpg",
        available: true,
        price: 20,
        upsize: 3,
        sizes: true,
        sizem: true,
        sizel: true,
        hot: false,
        cold: true,
    },
    {
        id: '4',
        name: 'Bánh Mì Đặc Biệt',
        category: 'Bánh',
        imageurl: "https://res.cloudinary.com/dkntmdcja/image/upload/v1736443313/doan/ualklwc8270sccaqevi3.jpg",
        available: true,
        price: 35,
        upsize: 0,
        sizes: true,
        sizem: false,
        sizel: false,
        hot: false,
        cold: false,
    },
    {
        id: '5',
        name: 'Cà Phê Đen',
        category: 'Cà Phê',
        imageurl: "https://res.cloudinary.com/dkntmdcja/image/upload/v1736443313/doan/ualklwc8270sccaqevi3.jpg",
        available: true,
        price: 20,
        upsize: 5,
        sizes: true,
        sizem: true,
        sizel: true,
        hot: true,
        cold: true,
    },
];

const Menu = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [search, setSearch] = useState<string>('');
    const [order, setOrder] = useState<{ [key: string]: { size: string; mood: string; quantity: number; price: number } }>({});
    const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
    const [selectedMoods, setSelectedMoods] = useState<{ [key: string]: string }>({});
    const [currentProductId, setCurrentProductId] = useState<string | null>(null);

    const handleSelectSize = (productId: string, size: string) => {
        // Nếu chọn sản phẩm mới, reset size và mood của sản phẩm khác
        if (currentProductId !== productId) {
            setSelectedSizes({});
            setSelectedMoods({});
        }
        setCurrentProductId(productId);
    
        // Cập nhật size cho sản phẩm hiện tại
        setSelectedSizes((prev) => ({
            ...prev,
            [productId]: size,
        }));
    };
    
    const handleSelectMood = (productId: string, mood: string) => {
        // Nếu chọn sản phẩm mới, reset size và mood của sản phẩm khác
        if (currentProductId !== productId) {
            setSelectedSizes({});
            setSelectedMoods({});
        }
        setCurrentProductId(productId);
    
        // Cập nhật mood cho sản phẩm hiện tại
        setSelectedMoods((prev) => ({
            ...prev,
            [productId]: mood,
        }));
    };
    
    const handleAddToOrder = (productId: string, size: string) => {
        const product = products.find((p) => p.id === productId);
        if (product && size) {
            const mood = product.hot || product.cold ? selectedMoods[productId] : ''; // Nếu không có mood thì mood là chuỗi rỗng
            let price = product.price;
            if (size === 'M') {
                price += product.upsize;
            } else if (size === 'L') {
                price += product.upsize * 2;
            }
    
            const key = `${productId}-${size}-${mood}`;
    
            setOrder((prevOrder) => ({
                ...prevOrder,
                [key]: {
                    size,
                    mood,
                    quantity: (prevOrder[key]?.quantity || 0) + 1,
                    price,
                },
            }));
    
            // Reset trạng thái size và mood
            setSelectedSizes({});
            setSelectedMoods({});
            setCurrentProductId(null);
        }
    };
    


    const handleRemoveItem = (productId: string, size: string, mood: string) => {
        const actualMood = mood || ''; // Nếu mood không tồn tại, sử dụng chuỗi rỗng
        const key = `${productId}-${size}-${actualMood}`; // Tạo key giống với key khi thêm vào order
        setOrder((prevOrder) => {
            const newOrder = { ...prevOrder };
            delete newOrder[key];
            return newOrder;
        });
    };
    

    const handleIncreaseQuantity = (productId: string, size: string, mood: string) => {
        const product = products.find((p) => p.id === productId);
        const actualMood = product?.hot || product?.cold ? mood : ''; // Nếu không có mood, dùng chuỗi rỗng
        const key = `${productId}-${size}-${actualMood}`;

        setOrder((prevOrder) => ({
            ...prevOrder,
            [key]: {
                ...prevOrder[key],
                quantity: prevOrder[key]?.quantity + 1 || 1,
            },
        }));
    };

    const handleDecreaseQuantity = (productId: string, size: string, mood: string) => {
        const product = products.find((p) => p.id === productId);
        const actualMood = product?.hot || product?.cold ? mood : ''; // Nếu không có mood, dùng chuỗi rỗng
        const key = `${productId}-${size}-${actualMood}`;

        setOrder((prevOrder) => {
            const newOrder = { ...prevOrder };
            if (newOrder[key]?.quantity > 1) {
                newOrder[key].quantity -= 1;
            } else {
                delete newOrder[key];
            }
            return newOrder;
        });
    };


    const filteredProducts = products.filter((product) =>
        selectedCategory === 'All' || product.category === selectedCategory
    ).filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="menu-container">
            <div className="menu-left">
                <h1 className="menu-title">Menu</h1>
                <div className="category-filter">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            type={selectedCategory === category ? 'primary' : 'default'}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
                <Input
                    className="search-input"
                    placeholder="Tìm kiếm sản phẩm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="product-cards">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="product-card">
                            <img src={product.imageurl} alt={product.name} className="product-image" />
                            <h3>{product.name}</h3>
                            <div className="size-options">
                                {product.sizes && (
                                    <Button
                                        key="S"
                                        className={`size-button ${selectedSizes[product.id] === 'S' ? 'selected' : ''}`}
                                        onClick={() => handleSelectSize(product.id, 'S')}
                                    >
                                        S
                                    </Button>
                                )}
                                {product.sizem && (
                                    <Button
                                        key="M"
                                        className={`size-button ${selectedSizes[product.id] === 'M' ? 'selected' : ''}`}
                                        onClick={() => handleSelectSize(product.id, 'M')}
                                    >
                                        M
                                    </Button>
                                )}
                                {product.sizel && (
                                    <Button
                                        key="L"
                                        className={`size-button ${selectedSizes[product.id] === 'L' ? 'selected' : ''}`}
                                        onClick={() => handleSelectSize(product.id, 'L')}
                                    >
                                        L
                                    </Button>
                                )}
                            </div>

                            {(product.hot || product.cold) && (
                                <div className="hot-cold-options">
                                    {product.hot && (
                                        <Button
                                            className={`mood-button ${selectedMoods[product.id] === 'Nóng' ? 'selected' : ''}`}
                                            onClick={() => handleSelectMood(product.id, 'Nóng')}
                                        >
                                            Nóng
                                        </Button>
                                    )}
                                    {product.cold && (
                                        <Button
                                            className={`mood-button ${selectedMoods[product.id] === 'Lạnh' ? 'selected' : ''}`}
                                            onClick={() => handleSelectMood(product.id, 'Lạnh')}
                                        >
                                            Lạnh
                                        </Button>
                                    )}
                                </div>
                            )}

                            <div className="price">
                                Giá: {selectedSizes[product.id] === 'M'
                                    ? product.price + product.upsize
                                    : selectedSizes[product.id] === 'L'
                                        ? product.price + product.upsize * 2
                                        : product.price}k
                            </div>
                            <Button
                                className="select-button"
                                onClick={() => handleAddToOrder(product.id, selectedSizes[product.id])}
                                disabled={
                                    !selectedSizes[product.id] ||
                                    (product.hot || product.cold) && !selectedMoods[product.id]
                                }
                            >
                                Chọn Món
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="menu-right">
                <h2>HÓA ĐƠN</h2>
                <div className="customer-info">
                    <Input placeholder="Số điện thoại khách hàng" />
                    <Input placeholder="Tên khách hàng" />
                    <Input placeholder="Ngày cập nhật" disabled value={new Date().toLocaleString()} />
                </div>
                <div className="order-items">
                    <h3>Món Đã Đặt</h3>
                    <div className="order-list">
                        {Object.keys(order).map((productKey) => {
                            const { size, mood, quantity, price } = order[productKey];
                            const [productId, selectedSize, selectedMood] = productKey.split('');
                            const product = products.find((p) => p.id === productId);
                            return product ? (
                                <div key={productKey} className="order-item-card">
                                    <img src={product.imageurl} alt={product.name} className="order-item-image" />
                                    <div>
                                        <div>{product.name} ({selectedSize})</div>
                                        <div>Size: {size}, Mood: {mood}</div>
                                        <div>Giá: {price * quantity}k</div>
                                    </div>
                                    <div className="quantity-controls">
                                        <Button onClick={() => handleDecreaseQuantity(productId, size, product.hot || product.cold ? mood : '')}>-</Button>
                                        <span>{quantity}</span>
                                        <Button onClick={() => handleIncreaseQuantity(productId, size, product.hot || product.cold ? mood : '')}>+</Button>
                                    </div>
                                    <Button
                                        className="remove-button"
                                        onClick={() => handleRemoveItem(productId, size, mood)}
                                    >
                                        X
                                    </Button>
                                </div>
                            ) : null;
                        })}
                    </div>
                </div>
                <div className="total-info">
                    <div>
                        <span>Tổng số món: </span>
                        <span>
                            {Object.values(order).reduce((total, item) => total + item.quantity, 0)}
                        </span>
                    </div>
                    <div>
                        <span>Tổng tiền: </span>
                        <span>
                            {Object.values(order).reduce(
                                (total, item) => total + item.price * item.quantity,
                                0
                            )}
                            k
                        </span>
                    </div>
                    <Button className="button">Thanh Toán</Button>
                </div>
            </div>
        </div>
    );
};

export default Menu;
