import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  productName: string;
  price: number;
  currency?: string;
  className?: string;
  inline?: boolean;
  label?: string;
  phoneNumber?: string;
}

export function WhatsAppButton({ productName, price, currency = "DZD", className, inline = false, label, phoneNumber }: WhatsAppButtonProps) {
  const priceStr = currency === "DZD" ? `${price.toLocaleString("ar-DZ")} دج` : `${price}€`;
  const message = encodeURIComponent(`مرحباً! أريد طلب: ${productName}\nالسعر: ${priceStr}`);
  const phone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, "") : "";
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  if (inline) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-[#25D366]/25",
          className
        )}
      >
        <MessageCircle className="w-5 h-5" />
        {label || "اطلب عبر WhatsApp"}
      </a>
    );
  }

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full shadow-2xl shadow-[#25D366]/30 transition-colors",
        className
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden sm:inline">{label || "اطلب الآن"}</span>
    </motion.a>
  );
}
