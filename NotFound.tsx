import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-4 text-center"
    >
      <Logo className="size-12 text-base" />
      <div>
        <p className="font-editor text-6xl font-bold text-primary">404</p>
        <p className="mt-3 font-editor text-sm text-muted-foreground">
          $ grep -r "страница" ./ && # ничего не найдено
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Такой страницы нет — но курс никуда не делся.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button className="font-editor" onClick={() => navigate("/")}>
          На главную
        </Button>
        <Button variant="outline" className="font-editor" onClick={() => navigate("/dashboard")}>
          К курсу
        </Button>
      </div>
    </motion.div>
  );
}
