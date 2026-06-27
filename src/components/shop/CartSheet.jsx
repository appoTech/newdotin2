import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";

const CartSheet = ({
  isOpen,
  setIsOpen,
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  totalAmount,
  groupedCartItems = {},
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-white/10 border-white/20 hover:bg-white/20"
        >
          <ShoppingCart className="h-4 w-4 text-white" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-900/95 border-gray-800">
        <SheetHeader>
          <SheetTitle className="text-white">Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {Object.entries(groupedCartItems).map(([creator, items]) => (
            <div key={creator} className="space-y-2">
              <h3 className="font-semibold text-lg text-white capitalize">
                {creator}'s Items
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 bg-white/10 p-3 rounded-lg"
                  >
                    <div>
                      <p className="text-white">{item.name}</p>
                      <p className="text-sm text-gray-400">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateQuantity?.(item.id, parseInt(e.target.value))
                        }
                        className="w-16 bg-white/20 border border-white/10 rounded px-2 py-1 text-white"
                      />
                      <button
                        onClick={() => onRemoveFromCart?.(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {cartItems.length > 0 && (
            <div className="border-t border-white/10 pt-4">
              <p className="text-lg font-semibold text-white">
                Total: ${totalAmount.toFixed(2)}
              </p>
            </div>
          )}
          {cartItems.length === 0 && (
            <p className="text-gray-400 text-center">Your cart is empty</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;