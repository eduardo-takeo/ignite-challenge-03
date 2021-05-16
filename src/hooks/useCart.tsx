import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  useEffect(() => {
    //TODO: Setar no localstorage toda vez que cart mudar
    console.log(`cart`, cart);
  }, [cart]);

  const addProduct = async (productId: number) => {
    try {
      const stock = await api.get(`/stock/${productId}`);
      const hasInStock = stock.data.amount > 0;

      if (!hasInStock) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      const existingItem = cart.find((cartItem) => cartItem.id === productId);

      if (existingItem) {
        const updatedCart = cart.map((cartItem) => {
          return cartItem.id === productId
            ? { ...cartItem, amount: cartItem.amount + 1 }
            : cartItem;
        });
        setCart(updatedCart);
        return;
      }

      const productToAdd = await api.get(`/products/${productId}`);

      setCart([...cart, { ...productToAdd.data, amount: 1 }]);
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
