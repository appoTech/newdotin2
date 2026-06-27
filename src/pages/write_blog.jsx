import Blogs_header from "../components/blogs_header";
import AnimatedTokens from "../components/AnimatedTokens";
import { SaturnSVG } from "../components/AnimatedTokens";
import { ToastContainer } from "react-toastify";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/card";
import { Feather } from "lucide-react";
import AddBlogForm from "../components/AddBlogForm";
import { useHistory } from "react-router-dom";
/* import Float from "../components/side_button"; */
import Floattwo from "../components/side_button2";
import BottomNav from "../components/bottom";
import Footer from "../components/Footer";
import G13Ads from "../components/g13ads";
import AdsterraAd from "../components/Adsterads";

function Write_blog() {
  const navigate = useHistory();
  return (
    <>
      <div>
        {/* <G13Ads /> */}
        <ToastContainer />
        <AdsterraAd/>
        <Blogs_header />
      </div>
      <AnimatedTokens />
      <div className="pt-[120px] font-rubik flex flex-col items-center justify-center">
        {/* <ThemeToggle /> */}

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Card className="max-w-3xl mx-auto animate-scale-in backdrop-blur-sm text-white border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="text-red-500">Create </span> New Blog{" "}
                <span className="text-yellow-500">Post</span>
                <div className="ml-auto flex items-center">
                  <Feather className="h-5 w-5 text-gold animate-float" />
                  <SaturnSVG className="h-6 w-6 animate-float ml-1" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddBlogForm onClose={() => navigate.push("/blog")} />
            </CardContent>
          </Card>
        </main>
      </div>

      <BottomNav />
      <Footer />
     {/*   <Float /> */}
      <Floattwo />
    </>
  );
}

export default Write_blog;
