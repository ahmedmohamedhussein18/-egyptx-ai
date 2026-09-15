import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginContent from "@/components/LoginContent";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col bg-[#030712]">
        <LoginContent />
      </main>
      <Footer />
    </>
  );
}
