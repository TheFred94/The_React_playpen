import { useState, useEffect } from "react";
import "./App.css";

// API: https://kea-alt-del.dk/t7/api/#parameters

function App() {
  //  Creates state and set it to [] (an empty array)
  const [articles, setArticles] = useState([]);
  const [basket, setBasket] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch("https://kea-alt-del.dk/t7/api/products?start=" + page * 10)
      .then((res) => res.json())
      .then((data) => {
        // set state which triggers the render again
        setArticles(data);
      });
  }, [page]);

  // Takes the state of the  and concats it with the product that corresponds to that of the "Buy Product" button
  function buyProduct(product) {
    // Find the basket item that matches the product ID
    const basketItem = basket.find((item) => item.id === product.id);

    if (basketItem) {
      // If the product already exists in the basket, increment the count of the BasketProduct
      const updatedBasket = basket.map((item) => (item.id === product.id ? { ...item, count: item.count + 1 } : item));
      // Update the basket state with the updated basket
      setBasket(updatedBasket);
    } else {
      // If the product does not exist in the basket, add it as a new item with count = 1
      // Add the new product to the basket state
      setBasket((oldBasket) => [...oldBasket, { ...product, count: 1 }]);
    }
  }

  // Removes the the product which is NOT equal to the id we recive from the function
  function removeProduct(id) {
    setBasket((oldBasket) => oldBasket.filter((product) => product.id !== id));
  }

  // Empties the array and removes all the products from the basket
  function emptyBasket() {
    setBasket((oldBasket) => (oldBasket = []));
  }

  return (
    <>
      <main>
        <section className="Product_List">
          {/* Sends down the buyProduct and articles to ProductList component */}
          <ProductList buyProduct={buyProduct} articles={articles} />
        </section>
        <section className="Basket">
          {/* Sends down emptyBasket, removeProduct and basket to Basket component */}
          <Basket emptyBasket={emptyBasket} removeProduct={removeProduct} basket={basket} />
        </section>
        <button className="load_more_products" onClick={() => setPage((oldPage) => oldPage + 1)}>
          Load 10 more products({page})
        </button>
      </main>
    </>
  );
}

function ProductList(props) {
  return (
    <ul>
      <h2>List of products</h2>
      {/* Receives the props.artcles from the App component */}
      {props.articles.map((article) => (
        // Sends down the props.buyProduct received from the App
        <Product buyProduct={props.buyProduct} article={{ ...article }} />
      ))}
    </ul>
  );
}

function Product(props) {
  const productid = props.article.id;
  const imagePath = `https://kea-alt-del.dk/t7/images/webp/640/${productid}.webp`;
  // Receives the props.article. passed down from App to ProductList to this Product component
  return (
    <li>
      <article className="product">
        <p>{props.article.productdisplayname}</p>
        <p>Price: {props.article.price} kr.</p>
        <span>{props.article.discount && <p className="onsale">On Sale!</p>}</span>
        <img src={imagePath} />
        <button onClick={() => props.buyProduct(props.article)}>Buy Product</button>
      </article>
    </li>
  );
}

// Receives the props. from the App component
function Basket(props) {
  return (
    <>
      <ul>
        <h2>Basket</h2>
        <button onClick={() => props.emptyBasket(props.product)}>Remove all items</button>
        {/* Creates a new ...product with the spreat operator */}
        {props.basket.map((product) => (
          // Passes down removeProduct and the ...product variable down to the BasketProduct component
          <BasketProduct removeProduct={props.removeProduct} product={{ ...product }} />
        ))}
      </ul>
    </>
  );
}

// Receives the props from Basket received from the App component and calls it props.product
function BasketProduct(props) {
  const productid = props.product.id;
  const imagePath = `https://kea-alt-del.dk/t7/images/webp/640/${productid}.webp`;

  return (
    <li>
      <article className="product">
        <p>{props.product.productdisplayname}</p>
        <p>Price: {props.product.price}</p>
        {/* If the count is greater that 0. If that is true it render the count paragraph */}
        <span>{props.product.count > 0 && <p>({props.product.count})</p>}</span>
        <img src={imagePath} />
        <button onClick={() => props.removeProduct(props.product.id)}>Remove product</button>
      </article>
    </li>
  );
}

export default App;
