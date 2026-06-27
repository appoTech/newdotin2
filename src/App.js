import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Ads from "./components/Ads";
import AppSuite from "./pages/AppSuite";
import { GetToken } from "./helper/api";
import { HelmetProvider } from "react-helmet-async";
const Homepage = lazy(() => import("./pages/Home"));
const Splashpage = lazy(() => import("./pages/Splash2"));
const Staticpage = lazy(() => import("./pages/Splash"));
const Testpage = lazy(() => import("./pages/test"));
const Dashboard_home = lazy(() => import("./components/Dashes"));
const DiwaliPage = lazy(() => import("./pages/Diwali"));
const SharedCardPage = lazy(() => import("./pages/SharedCard"));
// const Ads = lazy(() => import('./components/GoogleAd') );
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const FaqPage = lazy(() => import("./pages/faq"));
const TermsAndConditions = lazy(() => import("./pages/Terms"));
// const renderLoader = () => <p>Loading</p>;
const Trending = lazy(() => import("./pages/Trending"));
const BlogContent = lazy(() => import("./pages/blog_content"));
const BlogHome = lazy(() => import("./pages/blog_home"));
const WriteBlog = lazy(() => import("./pages/write_blog"));
const CancelandRefund = lazy(() => import("./pages/CancelandRefund"));
const ShipandDelivery = lazy(() => import("./pages/ShipandDelivery"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const get_token = lazy(() => import("./pages/get_token"));
const VisualShop = lazy(() => import("./pages/VisualShop"));
const WhyUs = lazy(() => import("./pages/Whyus"));
const syncwatch = lazy(() => import("./components/SyncYouTube"));
const LeaderRedirect = lazy(() => import("./components/LeaderRedirect"));
const ExpressPromote = lazy(() => import("./pages/ExpressPromote"));
const ExpressPager = lazy(() => import("./pages/ExpressPager"));
const Talkie = lazy(() => import("./pages/SignalsPage"));
const Omnitrix = lazy(() => import("./pages/OmnitrixPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const RetrieveLinks = lazy(() => import("./pages/RetrieveLinks"));
const stickerSplash = lazy(() => import("./pages/stickerSplash"))
const BarterArena = lazy(() => import("./pages/BarterArena"));
const TextToReel = lazy(() => import("./pages/TextToReel"));

const PrivateRoute = (props) => {
  const token = localStorage.getItem("aop_token");
  if (token) {
    return <Route exact={true} path={props.path} component={props.component} />;
  } else {
    return <Homepage {...props} />;
  }
};

function App() {
  const host = window.location.host.toLowerCase();
  const subdomain = host.split(".")[0];
  console.log("Host is : ", host);
  console.log("Subdomain is : ", subdomain);
  const domain = process.env.REACT_APP_DOMAIN;
  const domain2 = process.env.REACT_APP_DOMAIN_2;
  const domain3 = process.env.REACT_APP_DOMAIN_3;
  console.log("Domain 3 is : ", domain3);
  console.log("Checking condition : ", subdomain === domain3);
  var subdExists = false;

  const isMainDomain =
    subdomain === "www" ||
    host === domain?.toLowerCase() ||
    host === `www.${domain}`?.toLowerCase() ||
    (domain && subdomain === domain.toLowerCase()) ||
    (domain2 && subdomain === domain2.toLowerCase()) ||
    (domain3 && subdomain === domain3.toLowerCase());

  if (isMainDomain) {
    subdExists = false;
    return (
      <HelmetProvider>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/" component={Homepage}></Route>
              <Route
                exact
                path="/diwali/:id/:name"
                component={SharedCardPage}
              />
              {/* <Route exact path="/:apptype/:shorturl" component={DiwaliPage} /> */}
              <Route exact path="/user" component={Testpage}></Route>
              <Route
                exact
                path="/privacy-policy"
                component={PrivacyPolicy}
              ></Route>
              <Route
                exact
                path="/terms-and-conditions"
                component={TermsAndConditions}
              ></Route>
              <Route exact path="/faq" component={FaqPage}></Route>
              <Route exact path="/blog" component={BlogHome} />
              <Route exact path="/blog/:slug" component={BlogContent} />
              <Route exact path="/writeBlog" component={WriteBlog} />
              <Route exact path="/blog/:id" component={BlogContent} />
              <Route exact path="/trending" component={Trending} />
              <Route exact path="/getToken" component={get_token} />
              <Route exact path="/syncwatch/:id" component={syncwatch} />
              <Route exact path="/visualShop/:id" component={VisualShop} />
              <Route exact path="/why-us" component={WhyUs} />
              <Route path="/leader-redirect" component={LeaderRedirect} />
              <Route exact path="/talkie" component = {Talkie} />
              <Route exact path="/omnitricks" component={Omnitrix} />
              <Route exact path="/barter" component={BarterArena} />
              <Route exact path="/text-to-reel" component={TextToReel} />

              <Route
                exact
                path="/cancel-and-refund"
                component={CancelandRefund}
              />
              <Route
                exact
                path="/shipping-and-delivery"
                component={ShipandDelivery}
              />
              <Route exact path="/contact-us" component={ContactUs} />
              <Route exact path="/payment" component={PaymentPage} />
              <Route exact path="/express/promote" component={ExpressPromote} />
              <Route exact path="/express/pager" component={ExpressPager} />
              <Route exact path="/retrieve-links" component={RetrieveLinks} />
              <Route
                exact
                path="/:apptype/:shorturl"
                component={Splashpage}
              ></Route>
              <Route
                exact
                path="/:apptype/a4/:shorturl"
                component={stickerSplash}
              ></Route>
              <Route
                exact
                path="/link/:apptype/a4/:shorturl"
                component={Staticpage}
              ></Route>
              <Route
                exact
                path="/link/:apptype/:shorturl"
                component={Staticpage}
              ></Route>

              {/* <Route exact path='/ads.txt' component={Ads}></Route> */}
              <PrivateRoute
                path="/dashboard"
                component={Dashboard_home}
              ></PrivateRoute>
              {/* this if for error page 404 */}
              <Route component={Homepage}></Route>
            </Switch>
          </Suspense>
          {/* <Ads /> */}
        </Router>
      </HelmetProvider>
    );
  } else {
    console.log("Inside this backend 2 ");
    subdExists = true;
    return (
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => <AppSuite {...props} subdomain={subdomain} />}
            />
            <Route
              exact
              path="/:apptype/a4/:shorturl"
              render={(props) => <AppSuite {...props} subdomain={subdomain} />}
            />
            <Route
              exact
              path="/:apptype/:shorturl"
              render={(props) => <AppSuite {...props} subdomain={subdomain} />}
            />

            {/* this if for error page 404 */}
            <Route component={Homepage}></Route>
          </Switch>
        </Suspense>
        {/* <Ads /> */}
      </Router>
    );
  }
}

export default App;
