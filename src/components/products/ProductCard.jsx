import React from "react";
import { Card, Button } from "antd";

const ProductCard = ({ product }) => {
  return (
    <Card
      hoverable
      cover={<img alt={product.name} src={product.image} />}
      style={{ borderRadius: "8px" }}
    >
      <Card.Meta title={product.name} description={`$${product.price}`} />
      <Button type="primary" style={{ marginTop: "10px", width: "100%" }}>
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;
