export const CardProduct = ({ product }) => {
    return (
     
        <div className="card" >
           
            <h3 style={{textAlign : "center",color:"black",fontFamily:"TIMES NEW ROMAN"}}>{product.nombre}</h3>
            <p style={{fontSize : 40,"color":"black"}}>${product.precio.toFixed(2)}</p>


            {/* Renderizado condicional para mostrar un mensaje si el producto está en oferta */}
            {product.onSale && (
                <span style={{color:"green",fontSize: 20}} className="sale-badge">¡En Oferta!</span>
            )}
            {/* Renderizado condicional para mostrar un mensaje si el producto está agotado */}
            {product.outOfStock && (
                <span style={{color:"red",fontSize: 20}} className="out-of-stock-badge">Agotado</span>
            )}
        </div>
    );
}
       
